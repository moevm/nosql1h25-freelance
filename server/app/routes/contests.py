from flask import Blueprint, request, jsonify, url_for, current_app
from bson import ObjectId
from bson.errors import InvalidId
from app.database import contests_collection, users_collection
from app.utils import serialize_mongo
from app.schemas import validate_contest
from datetime import datetime
from werkzeug.utils import secure_filename
import os, re, json


contests_bp = Blueprint("contests", __name__)


# Маршрут для создания нового конкурса
@contests_bp.route("/contests", methods=["POST"])
def create_contest():
    data = json.loads(request.form.get('data'))
    files = request.files.getlist('files[]')
    file_paths = []
    file_urls = []
    filename_to_url = {}

    _id = ObjectId()

    for file in files:
        if file.filename != '':
            filename = secure_filename(file.filename)
            rel_path = os.path.join('contests_uploads', str(_id), filename)
            abs_path = os.path.join(current_app.static_folder, rel_path)

            os.makedirs(os.path.dirname(abs_path), exist_ok=True)
            file.save(abs_path)

            file_paths.append(f'/static/{rel_path}')
            file_url = url_for('static', filename=f'contests_uploads/{str(_id)}/{filename}', _external=True)
            file_urls.append(file_url)
            filename_to_url[filename] = file_url

    if 'description' in data:
        def replace_image_path(match):
            alt_text = match.group(1)
            image_filename = match.group(2)
            secure_name = secure_filename(image_filename)
            
            if secure_name in filename_to_url:
                return f"![{alt_text}]({filename_to_url[secure_name]})"
            return match.group(0)

        data['description'] = re.sub(
            r'!\[(.*?)\]\((.*?)\)',
            replace_image_path,
            data['description']
        )

    data['files'] = file_paths

    contest = validate_contest(data)

    contest['_id'] = _id
    last_contest = contests_collection.find_one(sort=[("number", -1)])
    next_number = 1 if last_contest is None else last_contest["number"] + 1
    contest["number"] = next_number

    res = contests_collection.insert_one(contest)
    return jsonify({"id": str(res.inserted_id)}), 201


@contests_bp.route("/contest/edit/<id>", methods=["POST"])
def update_contest(id):
    data = json.loads(request.form.get('data'))
    files = request.files.getlist('files[]')
    file_urls = []
    filename_to_url = {}

    current_contest = contests_collection.find_one({'number': int(id)});
    if (current_contest is None):
        return jsonify({"error": "Contest was not found"}), 404
    _id = current_contest['_id']
    data['number'] = current_contest['number']
    file_paths = current_contest['files']

    for file in files:
        if file.filename != '':
            filename = secure_filename(file.filename)
            rel_path = os.path.join('contests_uploads', str(_id), filename)
            abs_path = os.path.join(current_app.static_folder, rel_path)

            os.makedirs(os.path.dirname(abs_path), exist_ok=True)
            file.save(abs_path)

            file_paths.append(f'/static/{rel_path}')
            file_url = url_for('static', filename=f'contests_uploads/{str(_id)}/{filename}', _external=True)
            file_urls.append(file_url)
            filename_to_url[filename] = file_url

    if 'description' in data:
        def replace_image_path(match):
            alt_text = match.group(1)
            image_filename = match.group(2)
            secure_name = secure_filename(image_filename)
            
            if secure_name in filename_to_url:
                return f"![{alt_text}]({filename_to_url[secure_name]})"
            return match.group(0)

        data['description'] = re.sub(
            r'!\[(.*?)\]\((.*?)\)',
            replace_image_path,
            data['description']
        )

    data['files'] = file_paths

    contest = validate_contest(data)
    contests_collection.update_one(
        {'number': int(id)}, 
        {'$set': contest}
    )
    return jsonify({"id": str(contests_collection.find_one({'number': int(id)}))}), 201

def get_contests_on_page(page: int, query = {}):
    contests_per_page = 2
    total_contests = contests_collection.count_documents(query)
    total_pages = (total_contests + contests_per_page - 1) // contests_per_page
    start_idx = (page - 1) * contests_per_page
    contests_cursor = contests_collection.find(query).skip(start_idx).limit(contests_per_page)
    contests_list = list(contests_cursor)
    return total_pages, contests_list

@contests_bp.route("/contests/<id>", methods=["GET"])
def get_contests_by_page(id):
    total_pages, contests = get_contests_on_page(int(id))
    return jsonify({
        "total_pages": total_pages,
        "contests": serialize_mongo(contests)
    })


@contests_bp.route("/contests/filter/<id>", methods=["GET"])
def get_filtered_contests(id):
    min_reward = int(request.args.get("minReward", 0))
    max_reward = int(request.args.get("maxReward", 9999999))
    end_by = request.args.get("endBy", None)
    end_after = request.args.get("endAfter", None)
    types = request.args.get("types", None)
    search = request.args.get("search", None)
    statuses = request.args.get("statuses", None)
    employer_id = request.args.get("employerId", None)

    query = {
        "prizepool": {"$gte": min_reward, "$lte": max_reward}
    }

    end_by_conditions = {}

    if end_by:
        try:
            end_date = datetime.strptime(end_by, "%Y-%m-%d")
            end_by_conditions["$lte"] = end_date
        except ValueError:
            return jsonify({"error": "Invalid endBy date format"}), 400

    if end_after:
        try:
            end_date = datetime.strptime(end_after, "%Y-%m-%d")
            end_by_conditions["$gte"] = end_date
        except ValueError:
            return jsonify({"error": "Invalid endAfter date format"}), 400

    if end_by_conditions:
        query["endBy"] = end_by_conditions

    if types:
            type_ids = types.split(',')
            query["type"] = {"$in": type_ids}

    if statuses:
            try:
                status_ids = [int(status) for status in statuses.split(',')]
                query["status"] = {"$in": status_ids}
            except ValueError:
                return jsonify({"error": "Invalid status format"}), 400

    if search:
        regex = {"$regex": search, "$options": "i"}

        matching_users = list(users_collection.find({"login": regex}, {"_id": 1}))
        matching_user_ids = [str(user["_id"]) for user in matching_users]

        search_conditions = [
            {"title": regex},
            {"annotation": regex},
        ]

        if matching_user_ids:
            search_conditions.append({"employerId": {"$in": matching_user_ids}})

        query["$or"] = search_conditions

    if employer_id:
        query["employerId"] = employer_id

    total_pages, contests = get_contests_on_page(int(id), query)
    return jsonify({
        "total_pages": total_pages,
        "contests": serialize_mongo(contests)
    })


# Маршрут для получения одного конкурса по ID
@contests_bp.route("/contest/<id>", methods=["GET"])
def get_contest(id):
    try:
        contest = contests_collection.find_one({"_id": ObjectId(id)})
        if not contest:
            return jsonify({"error": "Конкурс не найден"}), 404
        return jsonify(serialize_mongo(contest))
    except InvalidId:
        return jsonify({"error": "Неверный ID"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Маршрут для получения конкурса по его порядковому номеру
@contests_bp.route("/contests/number/<int:number>", methods=["GET"])
def get_contest_by_number(number):
    try:
        contest = contests_collection.find_one({"number": number})
        if not contest:
            return jsonify({"error": "Конкурс не найден"}), 404
        return jsonify(serialize_mongo(contest))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@contests_bp.route("/contests/stats", methods=["GET"])
def get_stats():
    # Фильтры из запроса
    min_reward = int(request.args.get("minReward", 0))
    max_reward = int(request.args.get("maxReward", 9999999))
    end_by = request.args.get("endBy", None)
    end_after = request.args.get("endAfter", None)
    types = request.args.get("types", None)
    search = request.args.get("search", None)
    statuses = request.args.get("statuses", None)
    employer_id = request.args.get("employerId", None)

    x_field = request.args.get("xField")
    y_field = request.args.get("yField")

    # Классификация полей
    categorical_fields = ['type', 'status']
    date_fields = ['createdAt', 'endBy']
    numerical_fields = ['prizepool']

    # Проверка валидности полей
    valid_x_fields = categorical_fields + date_fields + numerical_fields
    valid_y_fields = categorical_fields + date_fields + numerical_fields + ['count']
    if x_field not in valid_x_fields or y_field not in valid_y_fields:
        return jsonify({"error": "Неверно выбраны поля"}), 400

    # Построение запроса фильтрации
    query = {
        "prizepool": {"$gte": min_reward, "$lte": max_reward}
    }

    if end_by:
        try:
            end_date = datetime.strptime(end_by, "%Y-%m-%d")
            query["endBy"] = {"$lte": end_date}
        except ValueError:
            return jsonify({"error": "Неверный формат даты endBy"}), 400

    if end_after:
        try:
            end_date = datetime.strptime(end_after, "%Y-%m-%d")
            if "endBy" in query:
                query["endBy"]["$gte"] = end_date
            else:
                query["endBy"] = {"$gte": end_date}
        except ValueError:
            return jsonify({"error": "Неверный формат даты endAfter"}), 400

    if types:
        type_ids = types.split(',')
        query["type"] = {"$in": type_ids}

    if statuses:
        try:
            status_ids = [int(status) for status in statuses.split(',')]
            query["status"] = {"$in": status_ids}
        except ValueError:
            return jsonify({"error": "Неверный формат статуса"}), 400

    if search:
        regex = {"$regex": search, "$options": "i"}
        matching_users = list(users_collection.find({"login": regex}, {"_id": 1}))
        matching_user_ids = [str(user["_id"]) for user in matching_users]
        search_conditions = [
            {"title": regex},
            {"annotation": regex},
        ]
        if matching_user_ids:
            search_conditions.append({"employerId": {"$in": matching_user_ids}})
        query["$or"] = search_conditions

    if employer_id:
        query["employerId"] = employer_id

    # Границы числовых значений
    if x_field in numerical_fields:
        min_max_x = list(contests_collection.aggregate([
            {"$match": query},
            {"$group": {
                "_id": None,
                "min_x": {"$min": f"${x_field}"},
                "max_x": {"$max": f"${x_field}"}
            }}
        ]))
        if not min_max_x:
            return jsonify({'x_labels': [], 'datasets': []})
        min_x = min_max_x[0]['min_x']
        max_x = min_max_x[0]['max_x']
        num_bins_x = 5
        bin_width_x = 1 if min_x == max_x else (max_x - min_x) / num_bins_x
        boundaries_x = [min_x + i * bin_width_x for i in range(num_bins_x)]
        boundaries_x.append(max_x + bin_width_x)
    else:
        min_x = max_x = bin_width_x = None

    if y_field != 'count' and y_field in numerical_fields:
        min_max_y = list(contests_collection.aggregate([
            {"$match": query},
            {"$group": {
                "_id": None,
                "min_y": {"$min": f"${y_field}"},
                "max_y": {"$max": f"${y_field}"}
            }}
        ]))
        if not min_max_y:
            return jsonify({'x_labels': [], 'datasets': []})
        min_y = min_max_y[0]['min_y']
        max_y = min_max_y[0]['max_y']
        num_bins_y = 5
        bin_width_y = 1 if min_y == max_y else (max_y - min_y) / num_bins_y
        boundaries_y = [min_y + i * bin_width_y for i in range(num_bins_y)]
        boundaries_y.append(max_y + bin_width_y)
    else:
        min_y = max_y = bin_width_y = None

    # Агрегация
    pipeline = [{"$match": query}]

    if x_field in numerical_fields:
        pipeline.append({"$addFields": {
            "x_group": {"$floor": {"$divide": [{"$subtract": [f"${x_field}", min_x]}, bin_width_x]}}
        }})
        pipeline.append({"$addFields": {
            "x_group": {"$min": ["$x_group", num_bins_x - 1]}
        }})
    elif x_field in date_fields:
        pipeline.append({"$addFields": {
            "x_group": {"$dateToString": {"format": "%Y-%m", "date": f"${x_field}"}}
        }})
    else:
        pipeline.append({"$addFields": {"x_group": f"${x_field}"}})

    if y_field != 'count':
        if y_field in numerical_fields:
            pipeline.append({"$addFields": {
                "y_group": {"$floor": {"$divide": [{"$subtract": [f"${y_field}", min_y]}, bin_width_y]}}
            }})
            pipeline.append({"$addFields": {
                "y_group": {"$min": ["$y_group", num_bins_y - 1]}
            }})
        elif y_field in date_fields:
            pipeline.append({"$addFields": {
                "y_group": {"$dateToString": {"format": "%Y-%m", "date": f"${y_field}"}}
            }})
        else:
            pipeline.append({"$addFields": {"y_group": f"${y_field}"}})

    if y_field == 'count':
        pipeline.append({"$group": {"_id": "$x_group", "count": {"$sum": 1}}})
        pipeline.append({"$sort": {"_id": 1}})
    else:
        pipeline.append({"$group": {"_id": {"x": "$x_group", "y": "$y_group"}, "count": {"$sum": 1}}})
        pipeline.append({"$sort": {"_id.x": 1, "_id.y": 1}})

    result = list(contests_collection.aggregate(pipeline))

    if y_field == 'count':
        x_values = [r['_id'] for r in result]
        if x_field in numerical_fields:
            x_labels = [f"{boundaries_x[int(i)]:.2f}-{boundaries_x[int(i)+1]:.2f}" for i in x_values]
        else:
            x_labels = [str(i) for i in x_values]
        datasets = [{'label': 'Количество', 'data': [r['count'] for r in result]}]
    else:
        x_values = sorted(set(r['_id']['x'] for r in result))
        if x_field in numerical_fields:
            x_labels = [f"{boundaries_x[int(i)]:.2f}-{boundaries_x[int(i)+1]:.2f}" for i in x_values]
        else:
            x_labels = [str(i) for i in x_values]

        y_values = sorted(set(r['_id']['y'] for r in result))
        if y_field in numerical_fields:
            y_labels = [f"{boundaries_y[int(y)]:.2f}-{boundaries_y[int(y)+1]:.2f}" for y in y_values]
        else:
            y_labels = [str(y) for y in y_values]

        data = {y: [0] * len(x_values) for y in y_values}
        for r in result:
            x = r['_id']['x']
            y = r['_id']['y']
            x_idx = x_values.index(x)
            data[y][x_idx] = r['count']
        datasets = [{'label': y_labels[y_values.index(y)], 'data': data[y]} for y in y_values]

    return jsonify({'x_labels': x_labels, 'datasets': datasets})
  
  
@contests_bp.route("/contests/<id>", methods=["DELETE"])
def delete_contest(id):
    # проверяем, что в заголовках пришла роль админа
    role = request.headers.get("X-User-Role", type=int)
    if role != 3:
        return jsonify({"error": "Forbidden"}), 403

    if not ObjectId.is_valid(id):
        return jsonify({"error": "Invalid contest ID"}), 400

    result = contests_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Contest not found"}), 404

    return jsonify({"message": "Contest deleted successfully"}), 200
