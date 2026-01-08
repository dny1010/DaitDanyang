import math
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity

from petShop.models import Question, User  # ✅ User 추가 (role 확인용)

board_bp = Blueprint("board", __name__, url_prefix="/api/board")

PER_PAGE_MAX = 50
PAGE_GROUP = 10  # 프론트 PAGE_GROUP와 맞추기


@board_bp.route("", methods=["GET", "OPTIONS"])
@board_bp.route("/", methods=["GET", "OPTIONS"])
@cross_origin()
@jwt_required(optional=True)
def board_list():
    # preflight 처리(브라우저가 OPTIONS 먼저 보내는 경우)
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    # ✅ 토큰이 있으면 user_id, 없으면 None
    user_id = get_jwt_identity()

    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("per_page", default=10, type=int)

    page = max(page, 1)
    limit = max(1, min(limit, PER_PAGE_MAX))

    # ✅ 기본 쿼리
    q = Question.query

    # =========================
    # ✅ 권한 필터 (정책 2번)
    # 비회원: NOTICE만
    # 로그인:
    #   - ADMIN: 전체
    #   - USER : NOTICE + 본인글
    # =========================
    if user_id is None:
        # 비회원이면 공지만
        q = q.filter(Question.board_type == "NOTICE")
    else:
        # 로그인한 경우 role 확인
        user = User.query.get(user_id)

        # 토큰은 있는데 유저가 없으면(비정상) -> 공지만 보여주기(안전)
        if not user:
            q = q.filter(Question.board_type == "NOTICE")
        else:
            if user.role == "admin":
                # ADMIN이면 전체 (필터 없음)
                pass
            else:
                # 일반 유저면 공지 + 본인글
                q = q.filter(
                    (Question.board_type == "NOTICE") | (Question.user_id == user_id)
                )

    # 정렬은 필터 후 적용
    q = q.order_by(Question.id.desc())

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

        # created_at/create_date 등 너희 모델 필드명에 따라 달라질 수 있음
        if getattr(row, "create_date", None):
            date_str = row.create_date.strftime("%Y-%m-%d")
        elif getattr(row, "created_at", None):
            date_str = row.created_at.strftime("%Y-%m-%d")
        else:
            date_str = ""

        # writer가 row에 저장되어 있으면 그걸 쓰고, 없으면 user에서 추정
        writer = getattr(row, "writer", None) or "unknown"
        if writer == "unknown" and hasattr(row, "user") and row.user:
            writer = getattr(row.user, "nickname", "unknown")

        result.append({
            "id": row.id,
            "title": title,
            "writer": writer,
            "date": date_str,
            "view": view,
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
    }), 200

@board_bp.get("/notices")
def list_notices():
    q = ((Question.query
         .filter(Question.category == "공지사항"))
         .order_by(Question.created_date.desc()))

    items = q.limit(3).all()

    return jsonify({
        "items": [
            {"id":n.id, "title": n.title, "date": n.created_date.strftime("%Y-%m-%d")}
            for n in items
        ]
    })