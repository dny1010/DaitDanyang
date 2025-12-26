# back/app.py
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from petShop.models import db
from petShop.views.product import product_bp
from petShop.views.wishlist import bp as wishlist_bp

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # 임시 SECRET_KEY 설정 (보안상 환경변수로 관리 권장)
    app.config['SECRET_KEY'] = 'dev_secret_key'

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "sqlite:///petshop.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    migrate.init_app(app, db)

    @app.get("/")
    def index():
        return "Petshop API OK"

    @app.post("/api/chat")
    def chat():
        data = request.get_json(silent=True) or {}
        message = data.get("message", "")
        return jsonify({"reply": f"너가 보낸: {message}"})

    # ✅ 이거 추가!
    app.register_blueprint(product_bp)
    app.register_blueprint(wishlist_bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

# ==============================================================================
# [Gemini 작업 로그] - 2025.12.26
# 1. Wishlist Blueprint 등록
#    - petShop.views.wishlist.bp (url_prefix='/api/wishlist')
# 2. SECRET_KEY 설정 (임시: 'dev_secret_key')
# ==============================================================================
