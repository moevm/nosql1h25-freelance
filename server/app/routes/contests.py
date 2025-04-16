from flask import Blueprint, request, jsonify
from bson import ObjectId
from bson.errors import InvalidId
from app.database import contests_collection
from app.utils import serialize_mongo
from app.schemas import validate_contest, validate_solution


contests_bp = Blueprint("contests", __name__)


# Маршрут для создания нового конкурса
@contests_bp.route("/contests", methods=["POST"])
def create_contest():
    data = request.get_json()
    contest = validate_contest(data)

    last_contest = contests_collection.find_one(sort=[("number", -1)])
    next_number = 1 if last_contest is None else last_contest["number"] + 1

    contest["number"] = next_number
    res = contests_collection.insert_one(contest)

    return jsonify({
        "id": str(res.inserted_id),
        "number": next_number
    }), 201


# Маршрут для получения списка всех конкурсов
@contests_bp.route("/contests", methods=["GET"])
def get_contests():
    contests = list(contests_collection.find({}))
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


@contests_bp.route("/contests/<contest_id>/solutions", methods=["POST"])
def create_solution(contest_id):
    data = request.get_json()

    try:
        solution = validate_solution(data)
    except Exception as e:
        return jsonify({"error": f"Неверные данные: {str(e)}"}), 400

    contest = contests_collection.find_one({"_id": ObjectId(contest_id)})
    if not contest:
        return jsonify({"error": f"Конкурс с id {contest_id} не найден"}), 404

    res = contests_collection.update_one(
        {"_id": contest["_id"]},
        {
            "$push": {"solutions": solution}
        }
    )

    if res.modified_count > 0:
        return jsonify({"id": str(res.upserted_id)}), 201
    else:
        return jsonify({"error": "Ошибка при добавлении решения"}), 500
