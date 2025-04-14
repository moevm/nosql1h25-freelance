from flask import Blueprint, request, jsonify
from app.database import contest_types_collection
from app.utils import serialize_mongo
from bson import ObjectId


contest_types_bp = Blueprint("contest_types", __name__)

@contest_types_bp.route("/contest-types", methods=["POST"])
def create_contest_type():
    data = request.get_json()
    if not data.get("name"):
        return jsonify({"error": "Missing 'name' field"}), 400

    contest_type = {
        "name": data["name"]
    }
    res = contest_types_collection.insert_one(contest_type)
    return jsonify({"id": str(res.inserted_id)}), 201

@contest_types_bp.route("/contest-types", methods=["GET"])
def get_contest_types():
    types = list(contest_types_collection.find({}))
    return jsonify(serialize_mongo(types))

@contest_types_bp.route("/contest-types/<id>", methods=["GET"])
def get_contest_type(id):
    contest_type = contest_types_collection.find_one({"_id": ObjectId(id)})
    if not contest_type:
        return jsonify({"error": "Not found"}), 404
    return jsonify(serialize_mongo(contest_type))

@contest_types_bp.route("/contest-types/<id>", methods=["DELETE"])
def delete_contest_type(id):
    res = contest_types_collection.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted successfully"})
