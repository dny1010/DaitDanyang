# app.py

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from petShop.models import db, User, Product, Order, Review, Address, Pet, Question, Answer

migrate = Migrate()  # 선택이지만 이렇게 빼두면 더 정석적이야


def create_app():
    app = Flask(__name__)
    CORS(app)

    # ✅ DB 설정
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///petshop.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ✅ db, migrate 초기화
    db.init_app(app)
    migrate.init_app(app, db)

    # ✅ 헬스 체크용 라우트
    @app.route("/")
    def index():
        return "Petshop API OK"

    # ✅ DB 테스트용 라우트 (원하면 나중에 지우면 됨)
    @app.route("/test-db")
    def test_db():
        test_user = User(
            user_id="test_user",
            password="1234",
            nickname="테스트유저",
            email="test@example.com"
        )
        db.session.add(test_user)
        db.session.commit()
        return "DB Insert OK"

    # ✅ DB 테스트용 라우트 (원하면 나중에 지우면 됨)
    @app.route("/test-db")
    def test_db():
        test_user = User(
            user_id="test_user",
            password="1234",
            nickname="테스트유저",
            email="test@example.com"
        )
        db.session.add(test_user)
        db.session.commit()
        return "DB Insert OK"

    from flask import jsonify, request
    import requests

    @app.route('/api/search', methods=['GET'])
    def naver_search():
        query = request.args.get('query')
        if not query:
            return jsonify({"error": "검색어가 없습니다."}), 400

        client_id = "_TF3O7N2mhW6Kshn8AkL"
        client_secret = "U7JdLSdXVs"
        search_api_url = "https://openapi.naver.com/v1/search/blog.json"

        headers = {
            "X-Naver-Client-Id": client_id,
            "X-Naver-Client-Secret": client_secret
        }
        params = {
            "query": query,
            "display": 10
        }

        response = requests.get(search_api_url, headers=headers, params=params)

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": "API 호출에 실패했습니다.", "details": response.json()}), response.status_code

    return app


app = create_app()

if __name__ == "__main__":
    with app.app_context():
        print("등록된 라우트들:", app.url_map)
    app.run(port=5000, debug=True)
