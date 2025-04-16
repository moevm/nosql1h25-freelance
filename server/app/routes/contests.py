from flask import Blueprint, request, jsonify, url_for, current_app
from app.database import contests_collection
from app.utils import serialize_mongo
from app.schemas import validate_contest
from werkzeug.utils import secure_filename
import os
import re
import json

contests_bp = Blueprint("contests", __name__)

# Маршрут для создания нового конкурса
@contests_bp.route("/contests", methods=["POST"])
def create_contest():
    data = json.loads(request.form.get('data'))
    files = request.files.getlist('files[]')
    file_paths = []
    file_urls = []
    filename_to_url = {}

    employer_id = data['employerId']
    employer_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], employer_id)
    os.makedirs(employer_folder, exist_ok=True)

    for file in files:
        if file.filename != '':
            filename = secure_filename(file.filename)
            rel_path = os.path.join('uploads', employer_id, filename)
            abs_path = os.path.join(current_app.static_folder, rel_path)

            os.makedirs(os.path.dirname(abs_path), exist_ok=True)
            file.save(abs_path)

            file_paths.append(f'/static/{rel_path}')
            file_url = url_for('static', filename=f'uploads/{employer_id}/{filename}', _external=True)
            file_urls.append(file_url)
            filename_to_url[filename] = file_url

    if 'description' in data:
        def replace_image_path(match):
            alt_text = match.group(1)
            image_filename = match.group(2)
            secure_name = secure_filename(image_filename)
            
            if secure_name in filename_to_url:
                return f"![{alt_text}]({filename_to_url[secure_name]})"
            return match.group(0)

        data['description'] = re.sub(
            r'!\[(.*?)\]\((.*?)\)',
            replace_image_path,
            data['description']
        )

    data['files'] = file_paths
    contest = validate_contest(data)
    res = contests_collection.insert_one(contest)
    return jsonify({"id": str(res.inserted_id)}), 201

# Маршрут для получения списка всех конкурсов
@contests_bp.route("/contests", methods=["GET"])
def get_contests():
    contests = list(contests_collection.find({}))
    return jsonify(serialize_mongo(contests))
