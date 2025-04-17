from flask import Blueprint, request, jsonify
from bson import ObjectId
from app.database import users_collection
from app.utils import serialize_mongo
from app.schemas import validate_user


users_bp = Blueprint("users", __name__)


# Маршрут для регистрации нового пользователя
@users_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    if users_collection.find_one({"login": data.get("login")}):
        return jsonify({"message": "Пользователь с таким логином уже существует"}), 409
    user = validate_user(data)
    res = users_collection.insert_one(user)
    created_user = users_collection.find_one({"_id": res.inserted_id}, {"password": 0})
    return jsonify({"message": "Регистрация прошла успешно", "user": serialize_mongo(created_user)}), 201


# Маршрут для получения списка всех пользователей (без паролей)
@users_bp.route("/users", methods=["GET"])
def get_users():
    users = list(users_collection.find({}, {"password": 0}))
    return jsonify(serialize_mongo(users))


# Маршрут для входа пользователя в систему
@users_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    login_input = data.get("login")
    password_input = data.get("password")

    # Поиск пользователя по логину (или email, если потребуется)
    user = users_collection.find_one({"login": login_input})
    if not user:
        return jsonify({"message": "Пользователь не найден"}), 404

    # Простейшая проверка пароля (пока без хэширования)
    if user["password"] != password_input:
        return jsonify({"message": "Неверные учётные данные"}), 401

    # Возвращаем пользователя без поля password
    return jsonify({
        "message": "Вход выполнен успешно",
        "user": serialize_mongo(user)
    }), 200
