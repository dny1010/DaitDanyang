# back/app.py
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from petShop.models import db

migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # ✅ 개발 단계: API만 CORS 허용
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # ✅ DB 설정 (환경변수 우선, 없으면 로컬 sqlite)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "sqlite:///petshop.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ✅ 확장 초기화
    db.init_app(app)
    migrate.init_app(app, db)

    # ✅ 헬스 체크
    @app.get("/")
    def index():
        return "Petshop API OK"

    # ✅ React ↔ Flask 연동 테스트용 API
    @app.post("/api/chat")
    def chat():
        data = request.get_json(silent=True) or {}
        message = data.get("message", "")
        return jsonify({
            "reply": f"너가 보낸: {message}"
        })

    return app


app = create_app()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
