import os, uuid

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from petShop.models import Review, db

review_bp = Blueprint('review', __name__, url_prefix='/api')

ALLOWED_EXT = {"png", "jpg", "jpeg", "webp"}

# 파일 이름에 .이 있고 확장자가 위 4개 중에 하나면 TRUE
# "." in filename = 파일명에 . 있는지 확인 / rsplit(".", 1) 오른쪽 기준으로 1번 자름
def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT

# 이미지 파일 삭제
def delete_image(img_url: str):
    if not img_url:
        return

    # 파일명 가져오기
    filename = os.path.basename(img_url)

    save_dir = current_app.config["UPLOAD_FOLDER_REVIEW"]
    file_path = os.path.join(save_dir, filename)

    if os.path.isfile(file_path):
        os.remove(file_path)

@review_bp.get('/product/<int:product_id>/reviews')
def list_reviews(product_id):
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=8, type=int)
    sort = request.args.get('sort', default='id_desc',type=str)

    q = Review.query.filter(Review.product_id ==product_id)

    if sort == "rating_desc":
        q = q.order_by(Review.rating.desc())
    elif sort == "rating_asc":
        q = q.order_by(Review.rating.asc())
    elif sort == "id_desc":
        q = q.order_by(Review.create_date.desc())
    else:
        q = q.order_by(Review.create_date.desc())

    total = q.count()
    items = (q.offset((page - 1) * limit).limit(limit).all())

    return jsonify({
        "items": [r.to_dict() for r in items],
        "page": page,
        "limit": limit,
        "total": total,
        "totalPages": (total + limit - 1) // limit
    })

@review_bp.post('/product/<int:product_id>/reviews')
@jwt_required()
def create_review(product_id):
    user_id = get_jwt_identity()

    rating = int(request.form.get("rating", 0))
    content = (request.form.get("content") or "").strip()

    if rating < 1 or rating > 5:
        return jsonify({"message": "별점은 1~5점만 가능합니다."}), 400
    if not content:
        return jsonify({"message": "내용을 입력해 주세요."}), 400

    img_url = None
    f = request.files.get("image")

    if f and f.filename:
        if not allowed_file(f.filename):
            return jsonify({"message": "이미지 확장자는 png/jpg/jpeg/webp만 가능합니다."}), 400

        safe = secure_filename(f.filename)
        ext = safe.rsplit(".", 1)[1].lower()
        new_name = f"{uuid.uuid4().hex}.{ext}"

        save_dir = current_app.config["UPLOAD_FOLDER_REVIEW"]
        save_path = os.path.join(save_dir, new_name)
        f.save(save_path)

        img_url = f"/static/uploads/reviews/{new_name}"

    r = Review(
        user_id=user_id,
        product_id=product_id,
        content=content,
        rating=rating,
        img_url=img_url)

    db.session.add(r)
    db.session.commit()
    return jsonify(r.to_dict()), 201

@review_bp.put('/reviews/<int:review_id>')
@jwt_required()
def update_review(review_id):
    user_id = get_jwt_identity()

    r = Review.query.get_or_404(review_id)

    # 내 리뷰만 수정 가능하게 유저 확인
    if r.user_id != user_id:
        return jsonify({"message": "권한이 없습니다."}), 403

    rating = request.form.get("rating", type=int)
    content = (request.form.get("content") or "").strip()

    if rating is not None:
        if rating < 1 or rating > 5:
            return jsonify({"message": "별점은 1~5점만 가능합니다."}), 400
        r.rating = rating

    if content:
        r.content = content

    # 이미지 교체 (선택)
    f = request.files.get("image")
    if f and f.filename:
        if not allowed_file(f.filename):
            return jsonify({"message": "이미지 확장자는 png/jpg/jpeg/webp만 가능합니다."}), 400

        # 기존파일 삭제
        delete_image(r.img_url)

        # 새 파일 저장
        safe = secure_filename(f.filename)
        ext = safe.rsplit(".", 1)[1].lower()
        new_name = f"{uuid.uuid4().hex}.{ext}"

        save_dir = current_app.config["UPLOAD_FOLDER_REVIEW"]
        os.makedirs(save_dir, exist_ok=True)
        f.save(os.path.join(save_dir, new_name))

        r.img_url = f"/static/uploads/reviews/{new_name}"

    db.session.commit()
    return jsonify(r.to_dict())

@review_bp.delete('/reviews/<int:review_id>')
@jwt_required()
def delete_review(review_id):
    user_id = get_jwt_identity()
    r = Review.query.get_or_404(review_id)

    if r.user_id != user_id:
        return jsonify({"message": "권한이 없습니다."}), 403

    # 파일 삭제
    delete_image(r.img_url)

    # DB row 삭제
    db.session.delete(r)
    db.session.commit()
    return jsonify({"message": "삭제 완료"})

@review_bp.get('/reviews/main')
def list_main_reviews():
    q = ((Review.query
          .filter(Review.img_url.isnot(None)))
          .order_by(Review.rating.desc(), Review.create_date.desc()))

    reviews = q.limit(3).all()

    return jsonify({
        "reviews": [{
            "id": r.id, "content": r.content, "date": r.create_date.strftime("%Y-%m-%d")}
            for r in reviews]
    })