from flask import Blueprint, request, jsonify, url_for, current_app
from bson import ObjectId
from bson.errors import InvalidId
from app.database import contests_collection
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


# Маршрут для получения списка всех конкурсов
@contests_bp.route("/contests", methods=["GET"])
def get_contests():
    contests = list(contests_collection.find({}))
    return jsonify(serialize_mongo(contests))

@contests_bp.route("/contests/filter", methods=["GET"])
def get_filtered_contests():
    min_reward = int(request.args.get("minReward", 0))
    max_reward = int(request.args.get("maxReward", 9999999))
    end_by = request.args.get("endBy", None)

    query = {
        "prizepool": {"$gte": min_reward, "$lte": max_reward}
    }

    if end_by:
        try:
            end_date = datetime.strptime(end_by, "%Y-%m-%d")
            query["endBy"] = {"$lte": end_date}
        except ValueError:
            return jsonify({"error": "Invalid endBy date format"}), 400

    contests = list(contests_collection.find(query))
    return jsonify(serialize_mongo(contests))


# Маршрут для получения одного конкурса по ID
@contests_bp.route("/contests/<id>", methods=["GET"])
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
