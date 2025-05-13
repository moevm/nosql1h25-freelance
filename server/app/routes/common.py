import os, io, zipfile
from flask import Blueprint, current_app, send_from_directory, jsonify, send_file


common_bp = Blueprint("common", __name__)


@common_bp.route("/files/<path:filename>", methods=["GET"])
def download_single_file(filename):
    try:
        directory = os.path.join(current_app.root_path, "static")
        return send_from_directory(directory, filename, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@common_bp.route("/download-folder/<path:folder_path>", methods=["GET"])
def download_folder_as_zip(folder_path):
    try:
        base_dir = os.path.join(current_app.root_path, "static")
        abs_folder_path = os.path.abspath(os.path.join(base_dir, folder_path))

        # Проверка безопасности: не вылезаем за пределы "static"
        if not abs_folder_path.startswith(base_dir):
            return jsonify({"error": "Недопустимый путь"}), 400

        if not os.path.isdir(abs_folder_path):
            return jsonify({"error": "Папка не найдена"}), 404

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(abs_folder_path):
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, abs_folder_path)
                    zipf.write(full_path, arcname=rel_path)

        zip_buffer.seek(0)
        folder_name = os.path.basename(abs_folder_path)
        return send_file(
            zip_buffer,
            mimetype="application/zip",
            as_attachment=True,
            download_name=f"{folder_name}.zip"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
