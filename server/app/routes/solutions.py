from flask import Blueprint, request, jsonify, url_for, current_app
from bson import ObjectId
from app.database import solutions_collection
from app.utils import serialize_mongo
from app.schemas import validate_solution, validate_review
from werkzeug.utils import secure_filename
import os, re, json


solutions_bp = Blueprint("solutions", __name__)


# Маршрут добавления нового решения
@solutions_bp.route("/solutions", methods=["POST"])
def create_solution():
    try:
        data = json.loads(request.form.get('data'))
        files = request.files.getlist('files[]')

        file_paths = []
        file_urls = []
        filename_to_url = {}

        _id = ObjectId()

        for file in files:
            if file.filename:
                filename = secure_filename(file.filename)
                rel_path = os.path.join('solutions_uploads', str(_id), filename)
                abs_path = os.path.join(current_app.static_folder, rel_path)

                os.makedirs(os.path.dirname(abs_path), exist_ok=True)
                file.save(abs_path)

                file_url = url_for('static', filename=f'solutions_uploads/{str(_id)}/{filename}', _external=True)
                file_paths.append(f'/static/{rel_path}')
                file_urls.append(file_url)
                filename_to_url[filename] = file_url

        if 'description' in data:
            def replace_image_path(match):
                alt_text = match.group(1)
                image_filename = secure_filename(match.group(2))
                if image_filename in filename_to_url:
                    return f"![{alt_text}]({filename_to_url[image_filename]})"
                return match.group(0)

            data['description'] = re.sub(
                r'!\[(.*?)\]\((.*?)\)',
                replace_image_path,
                data['description']
            )

        data['files'] = file_paths
        data['_id'] = _id
        last_solution = solutions_collection.find_one(sort=[("number", -1)])
        next_number = 1 if last_solution is None else last_solution["number"] + 1
        data["number"] = next_number

        solution = validate_solution(data)
        res = solutions_collection.insert_one(solution)
        return jsonify({"id": str(res.inserted_id)}), 201

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


# Маршрут удаления решения по ID
@solutions_bp.route("/solutions/<solution_id>", methods=["DELETE"])
def delete_solution(solution_id):
    try:
        if not ObjectId.is_valid(solution_id):
            return jsonify({"error": "Invalid solution ID"}), 400
            
        result = solutions_collection.delete_one({"_id": ObjectId(solution_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Solution not found"}), 404
            
        return jsonify({"message": "Solution deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Маршрут для обновления статуса решения
@solutions_bp.route("/solutions/<solution_id>", methods=["PUT"])
def update_solution(solution_id):
    try:
        data = request.json

        if not ObjectId.is_valid(solution_id):
            return jsonify({"error": "Invalid solution ID"}), 400

        # Проверяем статус (если он есть в запросе)
        if 'status' in data:
            if not isinstance(data['status'], int) or data['status'] not in range(1, 6):
                return jsonify({"error": "Invalid status value"}), 400

        result = solutions_collection.update_one(
            {"_id": ObjectId(solution_id)},
            {"$set": data}
        )

        if result.modified_count == 0:
            return jsonify({"error": "Solution not found or data not changed"}), 404

        # Возвращаем обновленный документ
        updated_solution = solutions_collection.find_one({"_id": ObjectId(solution_id)})
        return jsonify(serialize_mongo(updated_solution)), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Добавление ревью к решению
@solutions_bp.route("/solutions/<solution_id>/reviews", methods=["POST"])
def add_review(solution_id):
    if not ObjectId.is_valid(solution_id):
        return jsonify({"error": "Invalid solution ID"}), 400

    data = request.get_json()  # ожидаем { score: float, commentary: str }
    # получаем текущее решение
    sol = solutions_collection.find_one({"_id": ObjectId(solution_id)})
    if not sol:
        return jsonify({"error": "Solution not found"}), 404

    # вычисляем порядковый номер нового ревью
    existing = sol.get("reviews", [])
    next_number = len(existing) + 1

    # валидируем ревью через Pydantic
    review_dict = validate_review({
        **data,
        "number": next_number
    })

    # пушим в массив reviews
    solutions_collection.update_one(
        {"_id": ObjectId(solution_id)},
        {"$push": {"reviews": review_dict}}
    )

    return jsonify(review_dict), 201

# Получение всех ревью для решения
@solutions_bp.route("/solutions/<solution_id>/reviews", methods=["GET"])
def get_reviews(solution_id):
    if not ObjectId.is_valid(solution_id):
        return jsonify({"error": "Invalid solution ID"}), 400

    sol = solutions_collection.find_one(
        {"_id": ObjectId(solution_id)},
        {"reviews": 1, "_id": 0}
    )
    if not sol:
        return jsonify({"error": "Solution not found"}), 404

    return jsonify(serialize_mongo(sol["reviews"])), 200