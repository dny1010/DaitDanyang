# petShop/views/auth.py
import json
import re
from datetime import datetime

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from petShop.models import db, User, Pet

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def parse_weight_kg(value):
    """
    사용자가 입력한 몸무게 문자열을 kg 단위 숫자로 정규화.
    예: "3.2", "3.2kg", " 3.2 KG ", "3,2kg" -> 3.2
    비어있거나 파싱 불가면 None 반환
    """
    if value is None:
        return None

    # 이미 숫자로 온 경우
    if isinstance(value, (int, float)):
        return float(value)

    s = str(value).strip()
    if not s:
        return None

    s = s.lower().replace(",", ".")  # 3,2 -> 3.2

    # 숫자(정수/소수)만 추출
    m = re.search(r"(\d+(?:\.\d+)?)", s)
    if not m:
        return None

    try:
        return float(m.group(1))
    except ValueError:
        return None


@bp.get("/check-id")
def check_id():
    user_id = (request.args.get("userId") or request.args.get("user_id") or "").strip()
    if not user_id:
        return jsonify({"ok": False, "msg": "userId가 필요합니다."}), 400

    exists = User.query.filter_by(user_id=user_id).first() is not None
    if exists:
        return jsonify({"ok": False, "msg": "이미 사용 중인 아이디입니다."}), 200

    return jsonify({"ok": True, "msg": "사용 가능한 아이디입니다."}), 200


@bp.post("/register")
def register():
    data = request.get_json() or {}

    user_id = (data.get("userId") or data.get("user_id") or "").strip()
    password = data.get("password") or ""
    nickname = (data.get("nickname") or data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    default_address = (data.get("defaultAddress") or data.get("default_address") or "").strip() or None
    phone = (data.get("phone") or "").strip() or None

    # ✅ 관심동물(복수 선택) -> User.pet_list(JSON 문자열)
    pet_list = data.get("petList") or data.get("pet_list") or []

    # ✅ 실제 펫 등록(선택) -> Pet 테이블 (없어도 OK)
    pets = data.get("pets") or []

    # --- 유저 필수값 검증 ---
    if not user_id or not password or not nickname or not email:
        return jsonify({"ok": False, "msg": "필수 입력값이 누락되었습니다."}), 400

    # --- 중복 체크 ---
    if User.query.filter_by(user_id=user_id).first():
        return jsonify({"ok": False, "msg": "이미 사용 중인 아이디입니다."}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"ok": False, "msg": "이미 사용 중인 이메일입니다."}), 409

    # --- petList(관심) 검증 ---
    if pet_list and not isinstance(pet_list, list):
        return jsonify({"ok": False, "msg": "petList 형식이 올바르지 않습니다.(배열이어야 함)"}), 400

    allowed_interest = {"dog", "cat"}
    pet_list = [x for x in pet_list if x in allowed_interest]

    # --- pets(실제 등록) 검증: 없어도 OK ---
    if pets and not isinstance(pets, list):
        return jsonify({"ok": False, "msg": "pets 형식이 올바르지 않습니다.(배열이어야 함)"}), 400

    # --- 유저 생성 ---
    user = User(
        user_id=user_id,
        password=generate_password_hash(password),  # ✅ 해시 저장
        nickname=nickname,
        email=email,
        default_address=default_address,
        phone=phone,
        pet_list=json.dumps(pet_list, ensure_ascii=False),
    )
    db.session.add(user)
    db.session.flush()  # ✅ user.id 확보

    # --- 실제 펫이 있을 때만 Pet 생성 ---
    if pets:
        for p in pets:
            name = (p.get("name") or "").strip()
            pet_type = (p.get("petType") or p.get("pet_type") or "").strip()
            gender = (p.get("gender") or "").strip() or None

            # ✅ Date 컬럼: 문자열 -> date 변환
            birthday_raw = (p.get("birthday") or "").strip() or None
            birthday = None
            if birthday_raw:
                try:
                    birthday = datetime.strptime(birthday_raw, "%Y-%m-%d").date()
                except ValueError:
                    db.session.rollback()
                    return jsonify({"ok": False, "msg": "펫 생일 형식이 올바르지 않습니다. (YYYY-MM-DD)"}), 400

            breed = (p.get("breed") or "").strip() or None

            # ✅ weight: "3.2kg" 같은 입력도 파싱해서 float로 저장
            weight = parse_weight_kg(p.get("weight"))

            # 펫 최소 필수 (내 펫 등록을 하는 경우)
            if not name or not pet_type:
                db.session.rollback()
                return jsonify({"ok": False, "msg": "펫 등록 시 name, petType은 필수입니다."}), 400

            pet = Pet(
                user_id=user.id,  # ⚠️ Pet.user_id가 문자열이면 user.user_id로 변경
                name=name,
                pet_type=pet_type,
                gender=gender,
                birthday=birthday,
                breed=breed,
                weight=weight,
            )
            db.session.add(pet)

    db.session.commit()
    return jsonify({"ok": True, "msg": "회원가입 완료"}), 201


@bp.post("/login")
def login():
    data = request.get_json() or {}
    user_id = (data.get("userId") or data.get("user_id") or "").strip()
    password = data.get("password") or ""

    if not user_id or not password:
        return jsonify({"msg": "아이디와 비밀번호를 입력하세요"}), 400

    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({"msg": "아이디 또는 비밀번호가 올바르지 않습니다."}), 401

    # ✅ 해시 비교 우선
    if check_password_hash(user.password, password):
        access_token = create_access_token(identity=user_id)
        return jsonify({"accessToken": access_token}), 200

    # ✅ (임시 호환) 기존 평문 데이터면 로그인 성공 시 해시로 업그레이드
    if user.password == password:
        user.password = generate_password_hash(password)
        db.session.commit()
        access_token = create_access_token(identity=user_id)
        return jsonify({"accessToken": access_token}), 200

    return jsonify({"msg": "아이디 또는 비밀번호가 올바르지 않습니다."}), 401


@bp.get("/me")
@jwt_required()
def me():
    current_user = get_jwt_identity()
    return jsonify({"user": current_user}), 200
