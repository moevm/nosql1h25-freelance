from flask import Blueprint, request, jsonify
from app.database import contests_collection
from app.utils import serialize_mongo
from app.schemas import validate_contest


contests_bp = Blueprint('contests', __name__)

@contests_bp.route("/contests", methods=["POST"])
def create_contest():
    data = request.get_json()
    contest = validate_contest(data)
    res = contests_collection.insert_one(contest)
    return jsonify({"id": str(res.inserted_id)}), 201

@contests_bp.route("/contests", methods=["GET"])
def get_contests():
    contests = list(contests_collection.find({}))
    return jsonify(serialize_mongo(contests))
