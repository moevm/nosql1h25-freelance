from flask import Blueprint, request, jsonify, send_file, current_app
from bson import ObjectId
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

def restore_ids(docs):
    """Заменяет 'id' на '_id' в формате строки"""
    for doc in docs:
        if "id" in doc:
            try:
                doc["_id"] = str(ObjectId(doc["id"]))
            except Exception:
                continue
            del doc["id"]
    return docs

def convert_ids_to_objectid(docs):
    """Конвертирует строковые '_id' обратно в ObjectId для MongoDB"""
    for doc in docs:
        if "_id" in doc and isinstance(doc["_id"], str):
            try:
                doc["_id"] = ObjectId(doc["_id"])
            except Exception:
                continue
    return docs



# Экспорт всех данных
@import_export_bp.route("/import-export/export", methods=["GET"])
def export_data():
    try:
        users = list(users_collection.find({}))
        contests = list(contests_collection.find({}))
        solutions = list(solutions_collection.find({}))
        contest_types = list(contest_types_collection.find({}))

        data = {
            "users": [serialize_mongo(u) for u in users],
            "contests": [serialize_mongo(c) for c in contests],
            "solutions": [serialize_mongo(s) for s in solutions],
            "contestTypes": [serialize_mongo(t) for t in contest_types],
        }

        buffer = io.BytesIO()
        buffer.write(json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8"))
        buffer.seek(0)

        return send_file(
            buffer,
            mimetype="application/json",
            as_attachment=True,
            download_name="exported_data.json"
        )

    except Exception as e:
        current_app.logger.error("Ошибка при экспорте:\n" + traceback.format_exc())
        return jsonify({"error": "Ошибка при экспорте данных", "details": str(e)}), 500


# Импорт всех данных
@import_export_bp.route("/import-export/import", methods=["POST"])
def import_data():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "Файл не загружен"}), 400

    try:
        data = json.load(file)

        # Очистка коллекций
        users_collection.delete_many({})
        contests_collection.delete_many({})
        solutions_collection.delete_many({})
        contest_types_collection.delete_many({})

        # Валидация и преобразование
        users = [validate_user(u) for u in restore_ids(data.get("users", []))]
        contests = [validate_contest(c) for c in restore_ids(data.get("contests", []))]
        solutions = [validate_solution(s) for s in restore_ids(data.get("solutions", []))]
        types = [validate_contest_type(t) for t in restore_ids(data.get("contestTypes", []))]

        # Конвертация _id в ObjectId
        users = convert_ids_to_objectid(users)
        contests = convert_ids_to_objectid(contests)
        solutions = convert_ids_to_objectid(solutions)
        types = convert_ids_to_objectid(types)

        # Вставка
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
