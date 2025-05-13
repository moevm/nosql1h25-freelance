from flask import Blueprint, request, jsonify, send_file, current_app
from bson import ObjectId
import zipfile
import os
import tempfile
import shutil
from pathlib import Path
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


def import_from_zip(zip_path, static_root):
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)

            json_path = os.path.join(temp_dir, "exported_data.json")
            if not os.path.exists(json_path):
                raise FileNotFoundError("exported_data.json not found in archive")

            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            users_collection.delete_many({})
            contests_collection.delete_many({})
            solutions_collection.delete_many({})
            contest_types_collection.delete_many({})

            users = [validate_user(u) for u in restore_ids(data.get("users", []))]
            contests = [validate_contest(c) for c in restore_ids(data.get("contests", []))]
            solutions = [validate_solution(s) for s in restore_ids(data.get("solutions", []))]
            types = [validate_contest_type(t) for t in restore_ids(data.get("contestTypes", []))]

            if users: users_collection.insert_many(convert_ids_to_objectid(users))
            if contests: contests_collection.insert_many(convert_ids_to_objectid(contests))
            if solutions: solutions_collection.insert_many(convert_ids_to_objectid(solutions))
            if types: contest_types_collection.insert_many(convert_ids_to_objectid(types))

            for section in ['contests', 'solutions']:
                for item in data.get(section, []):
                    for file_path in item.get('files', []):
                        relative_path = file_path.lstrip("/")
                        src = os.path.join(temp_dir, relative_path)
                        dst = os.path.join(static_root, relative_path)
                        os.makedirs(os.path.dirname(dst), exist_ok=True)
                        if os.path.exists(src):
                            shutil.copy2(src, dst)

        return True
    except Exception as e:
        print(f"Import error: {str(e)}")
        return False

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

        with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
            # Добавляем JSON
            json_bytes = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
            zipf.writestr("exported_data.json", json_bytes)

            # Добавляем файлы из статики
            for section in ['contests', 'solutions']:
                for item in data[section]:
                    for file_path in item.get('files', []):
                        abs_path = os.path.join(current_app.root_path, file_path.lstrip("/"))
                        if os.path.exists(abs_path):
                            zipf.write(abs_path, arcname=file_path.lstrip("/"))

        buffer.seek(0)

        return send_file(
            buffer,
            mimetype="application/zip",
            as_attachment=True,
            download_name="exported_data_with_files.zip"
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
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            file.save(tmp.name)
            success = import_from_zip(
                tmp.name, 
                current_app.root_path
            )
        
        if success:
            return jsonify({"message": "Импорт завершён успешно"}), 200
        else:
            return jsonify({"error": "Ошибка при импорте данных"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
