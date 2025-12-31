# back/app.py
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from petShop.models import db

from petShop.views.cart import cart_bp
from petShop.views.product import product_bp
from petShop.views.review import review_bp
from petShop.views.wishlist import bp as wishlist_bp

from petShop.extensions import jwt
from petShop.views.auth import bp as auth_bp

migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # 기존에있던 시크릿키를 jwt로 수정함
    # 기존 SECRET_KEY는 Flask 세션/CSRF 등에 쓰일 수 있음(그대로 둬도 됨)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev_secret_key")

    # ✅ JWT-Extended는 보통 JWT_SECRET_KEY를 사용 (SECRET_KEY랑 분리 추천)
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev_jwt_secret_key")

    # CORS: /api/*만 열어둔 상태면 auth도 /api 아래로 두는 게 편함
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "sqlite:///petshop.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    migrate.init_app(app, db)

    # ✅ JWT 기능 장착 (이게 핵심)
    jwt.init_app(app)

    @app.get("/")
    def index():
        return "Petshop API OK"

    @app.post("/api/chat")
    def chat():
        data = request.get_json(silent=True) or {}
        message = data.get("message", "")
        return jsonify({"reply": f"너가 보낸: {message}"})

    # 블루프린트 등록
    app.register_blueprint(product_bp)
    app.register_blueprint(wishlist_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(auth_bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
