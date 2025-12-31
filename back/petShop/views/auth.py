# petShop/views/auth.py
from petShop.models import User
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@bp.post("/login")
def login():
    data = request.get_json() or {}
    user_id = data.get("user_id")
    password = data.get("password")

    if not user_id or not password:
        return jsonify({"msg": "아이디와 비밀번호를 입력하세요"}), 400

    # ✅ 1) DB에서 사용자 조회
    user = User.query.filter_by(user_id=user_id).first()

    # ✅ 2) 사용자 없으면 실패
    if not user:
        return jsonify({"msg": "아이디 또는 비밀번호가 틀렸습니다"}), 401

    # ✅ 3) 비밀번호 확인 (지금은 단순 비교)
    if user.password != password:
        return jsonify({"msg": "아이디 또는 비밀번호가 틀렸습니다"}), 401
    #로그인
    access_token = create_access_token(identity=user_id)
    #토큰 생성
    return jsonify({"access_token": access_token})

@bp.get("/me")
@jwt_required()
def me():
    # 토큰 검사 통과
    # 토큰 주인 확인
    current_user = get_jwt_identity()
    return jsonify({"user": current_user})
