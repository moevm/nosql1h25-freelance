from flask import Blueprint, request, jsonify
from bson import ObjectId
from app.database import contest_types_collection
from app.utils import serialize_mongo
from app.schemas import validate_contest_type


contest_types_bp = Blueprint("contest_types", __name__)


# Маршрут для создания нового типа конкурса
@contest_types_bp.route("/contest-types", methods=["POST"])
def create_contest_type():
    data = request.get_json()

    try:
        contest_type = validate_contest_type(data)
        res = contest_types_collection.insert_one(contest_type)
        return jsonify({
            "id": str(res.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Маршрут для получения списка всех типов конкурсов
@contest_types_bp.route("/contest-types", methods=["GET"])
def get_contest_types():
    types = list(contest_types_collection.find({}))
    return jsonify(serialize_mongo(types))


# Маршрут для получения одного типа конкурса по его ID
@contest_types_bp.route("/contest-types/<id>", methods=["GET"])
def get_contest_type(id):
    contest_type = contest_types_collection.find_one({"_id": ObjectId(id)})
    if not contest_type:
        return jsonify({"error": "Not found"}), 404
    return jsonify(serialize_mongo(contest_type))


# Маршрут для удаления типа конкурса по его ID
@contest_types_bp.route("/contest-types/<id>", methods=["DELETE"])
def delete_contest_type(id):
    res = contest_types_collection.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted successfully"})
