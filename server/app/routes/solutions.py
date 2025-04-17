from flask import Blueprint, request, jsonify
from bson import ObjectId
from app.database import solutions_collection
from app.utils import serialize_mongo
from app.schemas import validate_solution


solutions_bp = Blueprint("users", __name__)


# Маршрут добавления нового решения
@solutions_bp.route("/solutions", methods=["POST"])
def create_solution():
    data = request.get_json()

    try:
        solution = validate_solution(data)
        res = solutions_collection.insert_one(solution)
        return jsonify({
            "id": str(res.inserted_id)
        }), 201
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
