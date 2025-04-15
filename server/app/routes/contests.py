from flask import Blueprint, request, jsonify
from app.database import contests_collection
from app.utils import serialize_mongo
from app.schemas import validate_contest


contests_bp = Blueprint("contests", __name__)

# Маршрут для создания нового конкурса
@contests_bp.route("/contests", methods=["POST"])
def create_contest():
    data = request.get_json()
    contest = validate_contest(data)
    res = contests_collection.insert_one(contest)
    return jsonify({"id": str(res.inserted_id)}), 201

# Маршрут для получения списка всех конкурсов
@contests_bp.route("/contests", methods=["GET"])
def get_contests():
    contests = list(contests_collection.find({}))
    return jsonify(serialize_mongo(contests))

# Маршрут для получения отсортированных конкурсов
@contests_bp.route("/contests/filter", methods=["GET"])
def get_filtered_contests():
    try:
        min_reward = int(request.args.get("minReward", 0))
        max_reward = int(request.args.get("maxReward", 9999999))

        query = {
            "prizepool": {"$gte": min_reward, "$lte": max_reward}
        }

        contests = list(contests_collection.find(query))
        return jsonify(serialize_mongo(contests))

    except Exception as e:
        return jsonify({"error": str(e)}), 400