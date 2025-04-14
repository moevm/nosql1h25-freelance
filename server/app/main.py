from flask import Flask
from flask_cors import CORS
from app.routes.users import users_bp
from app.routes.contests import contests_bp
from app.routes.contest_types import contest_types_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}},
         supports_credentials=True)

    app.register_blueprint(users_bp, url_prefix="/api")
    app.register_blueprint(contests_bp, url_prefix="/api")
    app.register_blueprint(contest_types_bp, url_prefix="/api")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
