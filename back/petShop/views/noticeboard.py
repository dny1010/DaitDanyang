import math
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity

from petShop.models import Question, User

board_bp = Blueprint("board", __name__, url_prefix="/api/board")

PER_PAGE_MAX = 50
PAGE_GROUP = 10  # 프론트 PAGE_GROUP와 맞추기


def _get_user_from_identity():
    """
    ✅ auth.py에서 identity=user_id(문자열)로 토큰을 만들고 있음.
    그래서 여기서도 User.user_id로 조회해야 함.
    """
    ident = get_jwt_identity()  # 예: "admin" 또는 None
    if not ident:
        return None
    return User.query.filter_by(user_id=str(ident)).first()


def _is_admin(user: User | None) -> bool:
    return bool(user) and (user.role or "").upper() == "ADMIN"


@board_bp.route("", methods=["GET", "OPTIONS"])
@board_bp.route("/", methods=["GET", "OPTIONS"])
@cross_origin()
@jwt_required(optional=True)
def board_list():
    # preflight 처리(브라우저가 OPTIONS 먼저 보내는 경우)
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    user = _get_user_from_identity()

    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("per_page", default=10, type=int)

    page = max(page, 1)
    limit = max(1, min(limit, PER_PAGE_MAX))

    # ✅ 기본 쿼리
    q = Question.query

    # ✅ 공지사항은 따로(/notices) 보여줄 거라서 목록에서는 제외
    q = q.filter(Question.category != "공지사항")

    # ✅ 리스트는 "보기만"이라서
    # - 비회원도 전부 보이게(공지 제외)
    # - 회원도 전부 보이게(공지 제외)
    # - 관리자도 전부 보이게(공지 제외)
    # ※ 디테일 접근 제한은 read_post에서 막는다

    # 정렬
    q = q.order_by(Question.created_date.desc())

    # 전체 개수/페이지 계산
    total = q.order_by(None).count()
    total_pages = max(1, math.ceil(total / limit))

    if page > total_pages:
        page = total_pages

    items = q.offset((page - 1) * limit).limit(limit).all()

    result = []
    for row in items:
        title = getattr(row, "title", None) or getattr(row, "subject", "")
        view = getattr(row, "view_count", 0)

        date_str = row.created_date.strftime("%Y-%m-%d") if row.created_date else ""

        writer = row.user.nickname if getattr(row, "user", None) else "알수없음"

        result.append({
            "id": row.id,
            "title": title,
            "writer": writer,
            "date": date_str,
            "view": view,
            "category": row.category,
            # ✅ 비회원이면 디테일 불가(프론트에서 클릭 전에 안내 가능)
            "can_open_detail": True if user else False,
        })

    start_page = ((page - 1) // PAGE_GROUP) * PAGE_GROUP + 1
    end_page = min(start_page + PAGE_GROUP - 1, total_pages)

    return jsonify({
        "items": result,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages,
        "start_page": start_page,
        "end_page": end_page,
        "has_prev": page > 1,
        "has_next": page < total_pages,
        "is_logged_in": bool(user),
        "is_admin": _is_admin(user),
    }), 200


@board_bp.get("/notices")
def list_notices():
    q = ((Question.query
          .filter(Question.category == "공지사항"))
         .order_by(Question.created_date.desc()))

    items = q.limit(3).all()

    return jsonify({
        "items": [
            {"id": n.id, "title": n.title, "date": n.created_date.strftime("%Y-%m-%d") if n.created_date else ""}
            for n in items
        ]
    }), 200


@board_bp.route("/<int:question_id>", methods=["GET", "OPTIONS"])
@jwt_required(optional=True)
def read_post(question_id):
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    user = _get_user_from_identity()
    post = Question.query.get_or_404(question_id)

    # ✅ 공지사항은 누구나 디테일 가능
    if post.category == "공지사항":
        return jsonify({"item": post.to_dict()}), 200

    # ✅ 공지사항 아닌 글: 비회원은 디테일 불가
    if not user:
        return jsonify({"msg": "로그인이 필요합니다."}), 401

    # ✅ admin이면 전체 허용
    if _is_admin(user):
        return jsonify({"item": post.to_dict()}), 200

    # ✅ 일반 유저는 본인 글만
    if post.user_id != user.id:
        return jsonify({"msg": "권한이 없습니다."}), 403

    return jsonify({"item": post.to_dict()}), 200
