import math
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity

from petShop.models import Question

board_bp = Blueprint("board", __name__, url_prefix="/api/board")

PER_PAGE_MAX = 50
PAGE_GROUP = 10  # Category.jsx의 PAGE_GROUP와 맞추기

@board_bp.route("", methods=["GET", "OPTIONS"])
@board_bp.route("/", methods=["GET", "OPTIONS"])
@cross_origin()
@jwt_required(optional=True)
def board_list():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    user_id = get_jwt_identity()

    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("per_page", default=10, type=int)

    page = max(page, 1)
    limit = max(1, min(limit, PER_PAGE_MAX))

    q = Question.query.order_by(Question.id.desc())

    total = q.order_by(None).count()
    total_pages = max(1, math.ceil(total / limit))

    # page가 total_pages를 넘어가면 보정
    if page > total_pages:
        page = total_pages

    items = q.offset((page - 1) * limit).limit(limit).all()

    result = []
    for row in items:
        title = getattr(row, "title", None) or getattr(row, "subject", "")
        view = getattr(row, "view_count", 0)

        if getattr(row, "create_date", None):
            date_str = row.create_date.strftime("%Y-%m-%d")
        else:
            date_str = ""

        writer = "unknown"
        if hasattr(row, "user") and row.user:
            writer = getattr(row.user, "nickname", "unknown")

        result.append({
            "id": row.id,
            "title": title,
            "writer": writer,
            "date": date_str,
            "view": view,
        })

    # ✅ 페이지 그룹 계산 (start_page~end_page)
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
