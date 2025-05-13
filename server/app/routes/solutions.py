from flask import Blueprint, request, jsonify, url_for, current_app
from bson import ObjectId
from app.utils import serialize_mongo, serialize_mongo_doc
from app.database import solutions_collection, users_collection, contests_collection
from app.schemas import validate_solution, validate_review
from werkzeug.utils import secure_filename
from datetime import datetime
import os, re, json


solutions_bp = Blueprint("solutions", __name__)


@solutions_bp.route("/solutions", methods=["POST"])
def create_solution():
    try:
        data = json.loads(request.form.get('data'))

        files = request.files.getlist('files[]')

        # Проверяем обязательные поля
        if not data.get('contestId') or not ObjectId.is_valid(data.get('contestId')):
            return jsonify({"error": "Invalid or missing contestId"}), 400
        if not data.get('freelancerId') or not ObjectId.is_valid(data.get('freelancerId')):
            return jsonify({"error": "Invalid or missing freelancerId"}), 400
        if not data.get('title'):
            return jsonify({"error": "Missing title"}), 400
        if not data.get('annotation'):
            return jsonify({"error": "Missing annotation"}), 400
        if not data.get('description'):
            return jsonify({"error": "Missing description"}), 400

        file_paths = []
        file_urls = []
        filename_to_url = {}

        _id = ObjectId()

        for file in files:
            if file and file.filename:
                filename = secure_filename(file.filename)
                rel_path = os.path.join('solutions_uploads', str(_id), filename)
                abs_path = os.path.join(current_app.static_folder, rel_path)

                os.makedirs(os.path.dirname(abs_path), exist_ok=True)
                file.save(abs_path)

                file_url = url_for('static', filename=f'solutions_uploads/{str(_id)}/{filename}', _external=True)
                file_paths.append(f'/static/{rel_path}')
                file_urls.append(file_url)
                filename_to_url[filename] = file_url
            else:
                print("Skipping empty file:", file)

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
        data['_id'] = str(_id)
        last_solution = solutions_collection.find_one(sort=[("number", -1)])
        next_number = 1 if last_solution is None else last_solution["number"] + 1
        data["number"] = next_number

        print("Data before validation:", data)
        solution = validate_solution(data)
        print("Validated solution:", solution)

        solution['_id'] = _id

        res = solutions_collection.insert_one(solution)
        return jsonify({"id": str(res.inserted_id)}), 201

    except json.JSONDecodeError as e:
        print("JSON decode error:", str(e))
        return jsonify({"error": "Invalid JSON in data field"}), 400
    except Exception as e:
        print("Error in create_solution:", str(e))
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


# Маршрут получения решения по его номеру
@solutions_bp.route("/solutions/number/<int:number>", methods=["GET"])
def get_solution_by_number(number):
    try:
        solution = solutions_collection.find_one({"number": int(number)})
        if not solution:
            return jsonify({"error": "Solution not found"}), 404
        return jsonify(serialize_mongo(solution)), 200
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


# Маршрут для получения отфильтрованных решений
@solutions_bp.route("/solutions/filter", methods=["GET"])
def get_filtered_contests():
    addedBefore = request.args.get("addedBefore", None)
    addedAfter = request.args.get("addedAfter", None)
    search = request.args.get("search", None)
    statuses = request.args.get("statuses", None)
    freelancer_id = request.args.get("freelancerId", None)
    contest_id = request.args.get("contestId", None)
    search_for_my_solutions = request.args.get("searchForMySolutions", None)

    query = {}

    updated_at_conditions = {}

    if addedBefore:
        try:
            added_before_date = datetime.strptime(addedBefore, "%Y-%m-%d")
            updated_at_conditions["$lte"] = added_before_date
        except ValueError:
            return jsonify({"error": "Invalid addedBefore date format"}), 400

    if addedAfter:
        try:
            added_after_date = datetime.strptime(addedAfter, "%Y-%m-%d")
            updated_at_conditions["$gte"] = added_after_date
        except ValueError:
            return jsonify({"error": "Invalid addedAfter date format"}), 400

    if updated_at_conditions:
        query["updatedAt"] = updated_at_conditions

    if statuses:
            try:
                status_ids = [int(status) for status in statuses.split(',')]
                query["status"] = {"$in": status_ids}
            except ValueError:
                return jsonify({"error": "Invalid status format"}), 400

    if search:
        regex = {"$regex": search, "$options": "i"}
        search_conditions = []

        search_conditions.append({"title": regex})
        search_conditions.append({"annotation": regex})

        if search_for_my_solutions:
            contest_query = {
                "$or": [
                    {"title": regex},
                    {"annotation": regex}
                ]
            }

            matching_employers = list(users_collection.find({"login": regex}, {"_id": 1}))
            matching_employer_ids = [str(employer["_id"]) for employer in matching_employers]
            if matching_employer_ids:
                contest_query["$or"].append({"employerId": {"$in": matching_employer_ids}})

            matching_contests = list(contests_collection.find(contest_query, {"_id": 1}))
            matching_contest_ids = [str(contest["_id"]) for contest in matching_contests]

            if matching_contest_ids:
                search_conditions.append({"contestId": {"$in": matching_contest_ids}})
        else:
            matching_users = list(users_collection.find({"login": regex}, {"_id": 1}))
            matching_user_ids = [str(user["_id"]) for user in matching_users]
            if matching_user_ids:
                search_conditions.append({"freelancerId": {"$in": matching_user_ids}})

        query["$or"] = search_conditions

    if freelancer_id:
        query["freelancerId"] = freelancer_id

    if contest_id:
        query["contestId"] = contest_id

    solutions = list(solutions_collection.find(query))

    contest_ids = {solution["contestId"] for solution in solutions}
    contests = list(contests_collection.find({"_id": {"$in": [ObjectId(cid) for cid in contest_ids]}}))

    contest_map = {}
    employer_ids = set()
    for contest in contests:
        cid = str(contest["_id"])
        contest_map[cid] = contest
        if "employerId" in contest:
            employer_ids.add(ObjectId(contest["employerId"]))

    freelancer_ids = {ObjectId(s["freelancerId"]) for s in solutions if "freelancerId" in s}

    all_user_ids = list(freelancer_ids.union(employer_ids))
    users = list(users_collection.find({"_id": {"$in": all_user_ids}}, {"login": 1}))
    user_logins = {str(user["_id"]): user["login"] for user in users}

    for solution in solutions:
        contest_id = solution.get("contestId")
        contest = contest_map.get(contest_id)

        employer_id = contest.get("employerId") if contest else None
        solution["contestTitle"] = contest.get("title", "Неизвестный конкурс") if contest else "Неизвестный конкурс"
        solution["freelancerLogin"] = user_logins.get(solution.get("freelancerId"))
        solution["employerLogin"] = user_logins.get(str(employer_id)) if employer_id else None

    return jsonify(serialize_mongo(solutions))


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



# Редактирование ревью по номеру внутри решения
@solutions_bp.route("/solutions/<solution_id>/reviews/<int:review_number>", methods=["PUT"])
def update_review(solution_id, review_number):
    if not ObjectId.is_valid(solution_id):
        return jsonify({"error": "Invalid solution ID"}), 400

    data = request.get_json()
    # валидация через Pydantic, но без overwriting number/createdAt
    review_dict = validate_review({
        **data,
        "number": review_number
    })

    result = solutions_collection.update_one(
        {"_id": ObjectId(solution_id), "reviews.number": review_number},
        {"$set": {
            "reviews.$.score": review_dict["score"],
            "reviews.$.commentary": review_dict["commentary"],
            "reviews.$.updatedAt": review_dict["updatedAt"]
        }}
    )
    if result.modified_count == 0:
        return jsonify({"error": "Review not found"}), 404

    # вернуть обновлённое ревью
    sol = solutions_collection.find_one({"_id": ObjectId(solution_id)}, {"reviews": 1})
    updated = next((r for r in sol["reviews"] if r["number"] == review_number), None)
    return jsonify(serialize_mongo_doc(updated)), 200

# Удаление ревью по номеру внутри решения
@solutions_bp.route("/solutions/<solution_id>/reviews/<int:review_number>", methods=["DELETE"])
def delete_review(solution_id, review_number):
    if not ObjectId.is_valid(solution_id):
        return jsonify({"error": "Invalid solution ID"}), 400

    result = solutions_collection.update_one(
        {"_id": ObjectId(solution_id)},
        {"$pull": {"reviews": {"number": review_number}}}
    )
    if result.modified_count == 0:
        return jsonify({"error": "Review not found"}), 404

    return jsonify({"message": "Review deleted"}), 200

