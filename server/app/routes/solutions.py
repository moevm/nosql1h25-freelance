from flask import Blueprint, request, jsonify, url_for, current_app
from bson import ObjectId
from app.database import solutions_collection, users_collection, contests_collection
from app.utils import serialize_mongo
from app.schemas import validate_solution
from werkzeug.utils import secure_filename
from datetime import datetime
import os, re, json


solutions_bp = Blueprint("solutions", __name__)


# Маршрут добавления нового решения
@solutions_bp.route("/solutions", methods=["POST"])
def create_solution():
    try:
        data = json.loads(request.form.get('data'))
        files = request.files.getlist('files[]')

        file_paths = []
        file_urls = []
        filename_to_url = {}

        _id = ObjectId()

        for file in files:
            if file.filename:
                filename = secure_filename(file.filename)
                rel_path = os.path.join('solutions_uploads', str(_id), filename)
                abs_path = os.path.join(current_app.static_folder, rel_path)

                os.makedirs(os.path.dirname(abs_path), exist_ok=True)
                file.save(abs_path)

                file_url = url_for('static', filename=f'solutions_uploads/{str(_id)}/{filename}', _external=True)
                file_paths.append(f'/static/{rel_path}')
                file_urls.append(file_url)
                filename_to_url[filename] = file_url

        if 'description' in data:
            def replace_image_path(match):
                alt_text = match.group(1)
                image_filename = secure_filename(match.group(2))
                if image_filename in filename_to_url:
                    return f"![{alt_text}]({filename_to_url[image_filename]})"
                return match.group(0)

            data['description'] = re.sub(
                r'!\[(.*?)\]\((.*?)\)',
                replace_image_path,
                data['description']
            )

        data['files'] = file_paths
        data['_id'] = _id
        last_solution = solutions_collection.find_one(sort=[("number", -1)])
        next_number = 1 if last_solution is None else last_solution["number"] + 1
        data["number"] = next_number

        solution = validate_solution(data)
        res = solutions_collection.insert_one(solution)
        return jsonify({"id": str(res.inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Маршрут получения всех решений одного пользователя-фрилансера
@solutions_bp.route("/solutions/user/<user_id>", methods=["GET"])
def get_solutions_by_user(user_id):
    try:
        solutions = list(solutions_collection.find({"freelancerId": user_id}))
        return jsonify(serialize_mongo(solutions)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Маршрут получения всех решений одного конкурса
@solutions_bp.route("/solutions/contest/<contest_id>", methods=["GET"])
def get_solutions_by_contest(contest_id):
    try:
        solutions = list(solutions_collection.find({"contestId": contest_id}))
        return jsonify(serialize_mongo(solutions)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Маршрут удаления решения по ID
@solutions_bp.route("/solutions/<solution_id>", methods=["DELETE"])
def delete_solution(solution_id):
    try:
        if not ObjectId.is_valid(solution_id):
            return jsonify({"error": "Invalid solution ID"}), 400
            
        result = solutions_collection.delete_one({"_id": ObjectId(solution_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Solution not found"}), 404
            
        return jsonify({"message": "Solution deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Маршрут для обновления статуса решения
@solutions_bp.route("/solutions/<solution_id>", methods=["PUT"])
def update_solution(solution_id):
    try:
        data = request.json

        if not ObjectId.is_valid(solution_id):
            return jsonify({"error": "Invalid solution ID"}), 400

        # Проверяем статус (если он есть в запросе)
        if 'status' in data:
            if not isinstance(data['status'], int) or data['status'] not in range(1, 6):
                return jsonify({"error": "Invalid status value"}), 400

        result = solutions_collection.update_one(
            {"_id": ObjectId(solution_id)},
            {"$set": data}
        )

        if result.modified_count == 0:
            return jsonify({"error": "Solution not found or data not changed"}), 404

        # Возвращаем обновленный документ
        updated_solution = solutions_collection.find_one({"_id": ObjectId(solution_id)})
        return jsonify(serialize_mongo(updated_solution)), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Маршрут для получения отфильтрованных решений
@solutions_bp.route("/solutions/filter", methods=["GET"])
def get_filtered_contests():
    addedBefore = request.args.get("addedBefore", None)
    addedAfter = request.args.get("addedAfter", None)
    search = request.args.get("search", None)
    statuses = request.args.get("statuses", None)
    freelancer_id = request.args.get("freelancerId", None)
    contest_id = request.args.get("contestId", None)

    query = {}

    updated_at_conditions = {}

    if addedBefore:
        try:
            added_before_date = datetime.strptime(addedBefore, "%Y-%m-%d")
            updated_at_conditions["$lte"] = added_before_date
        except ValueError:
            return jsonify({"error": "Invalid addedBefore date format"}), 400

    if addedAfter:
        try:
            added_after_date = datetime.strptime(addedAfter, "%Y-%m-%d")
            updated_at_conditions["$gte"] = added_after_date
        except ValueError:
            return jsonify({"error": "Invalid addedAfter date format"}), 400

    if updated_at_conditions:
        query["updatedAt"] = updated_at_conditions

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
            {"description": regex}
        ]

        if matching_user_ids:
            search_conditions.append({"freelancerId": {"$in": matching_user_ids}})

        query["$or"] = search_conditions

    if freelancer_id:
        query["freelancerId"] = freelancer_id

    if contest_id:
        query["contestId"] = contest_id

    solutions = list(solutions_collection.find(query))

    contest_ids = {solution["contestId"] for solution in solutions}
    contests = contests_collection.find({"_id": {"$in": [ObjectId(cid) for cid in contest_ids]}})
    contest_titles = {str(contest["_id"]): contest["title"] for contest in contests}
    for solution in solutions:
        solution["contestTitle"] = contest_titles.get(solution["contestId"], "Неизвестный конкурс")

    return jsonify(serialize_mongo(solutions))
