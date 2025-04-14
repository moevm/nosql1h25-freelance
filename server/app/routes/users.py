from flask import Blueprint, request, jsonify
from app.database import users_collection
from app.utils import serialize_mongo
from app.schemas import validate_user


users_bp = Blueprint("users", __name__)

@users_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    user = validate_user(data)
    res = users_collection.insert_one(user)
    return jsonify({"id": str(res.inserted_id)}), 201

@users_bp.route("/users", methods=["GET"])
def get_users():
    users = list(users_collection.find({}, {"password": 0}))
    return jsonify(serialize_mongo(users))
