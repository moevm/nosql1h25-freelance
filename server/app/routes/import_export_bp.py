from flask import Blueprint, request, jsonify, send_file, current_app
from app.database import (
    users_collection,
    contests_collection,
    solutions_collection,
    contest_types_collection,
)
from app.schemas import (
    validate_user,
    validate_contest,
    validate_solution,
    validate_contest_type,
)
from app.utils import serialize_mongo
import io, json, traceback


import_export_bp = Blueprint("import_export", __name__)

# Импорт всех данных
@import_export_bp.route("/import-export/import", methods=["POST"])
def import_data():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "Файл не загружен"}), 400

    try:
        data = json.load(file)

        # Очистка старых данных
        users_collection.delete_many({})
        contests_collection.delete_many({})
        solutions_collection.delete_many({})
        contest_types_collection.delete_many({})

        # Валидация и вставка
        users = [validate_user(u) for u in data.get("users", [])]
        contests = [validate_contest(c) for c in data.get("contests", [])]
        solutions = [validate_solution(s) for s in data.get("solutions", [])]
        types = [validate_contest_type(t) for t in data.get("contestTypes", [])]

        if users:
            users_collection.insert_many(users)
        if contests:
            contests_collection.insert_many(contests)
        if solutions:
            solutions_collection.insert_many(solutions)
        if types:
            contest_types_collection.insert_many(types)

        return jsonify({"message": "Импорт завершён успешно"}), 200

    except Exception as e:
        current_app.logger.error("Ошибка при импорте:\n" + traceback.format_exc())
        return jsonify({"error": "Ошибка при импорте данных", "details": str(e)}), 500
