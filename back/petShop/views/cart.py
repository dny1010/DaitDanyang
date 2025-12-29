from flask import Blueprint, request, jsonify, current_app
from functools import wraps
import jwt

from petShop.models import Cart, Product, User, db

bp = Blueprint("cart", __name__, url_prefix="/api/cart")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token is missing!"}), 401
        try:
            if token.startswith("Bearer "):
                token = token.split(" ")[1]
            secret = current_app.config.get("SECRET_KEY", "dev_secret_key")
            data = jwt.decode(token, secret, algorithms=["HS256"])

            raw_id = data.get("user_id")
            user = User.query.filter((User.id == raw_id) | (User.user_id == raw_id)).first()
            if not user:
                return jsonify({"message": "User not found"}), 404

            return f(user.id, *args, **kwargs)
        except Exception as e:
            return jsonify({"message": "Token is invalid!", "error": str(e)}), 401
    return decorated

# 장바구니 목록 조회 / 현재 유저의 cart를 가져와 carts를 돌면서(for문 축약형인 리스트 컴프리헨션) json으로 바꿔줌
@bp.route("", methods=["GET"])
@token_required
def get_cart(current_user_id):
    carts = Cart.query.filter_by(user_id=current_user_id).all()
    return jsonify([{
        "id": c.id,
        "product_id": c.product_id,
        "count": c.count,
        "product": c.product.to_dict() if c.product else None
    } for c in carts]), 200

# 장바구니 추가
@bp.route("", methods=["POST"])
@token_required
def add_cart(current_user_id):
    data = request.get_json() or {}
    product_id = data.get("product_id")
    count = int(data.get("count", 1))

# 유효성 검사 product_id가 없거나 db에 없으면 404
    if not product_id:
        return jsonify({"message": "product_id is required"}), 400
    if not Product.query.get(product_id):
        return jsonify({"message": "Product not found"}), 404

# 이미 담긴 상품인지 확인 / 수정이니까 200
    exist = Cart.query.filter_by(user_id=current_user_id, product_id=product_id).first()
    if exist:
        exist.count += count
        db.session.commit()
        return jsonify({"id": exist.id, "product_id": exist.product_id, "count": exist.count}), 200

# 없으면 카트에 담기 / 새로 만드니까 201
    item = Cart(user_id=current_user_id, product_id=product_id, count=count)
    db.session.add(item)
    db.session.commit()
    return jsonify({"id": item.id, "product_id": item.product_id, "count": item.count}), 201


# 수량 변경
@bp.route("/<int:cart_id>", methods=["PATCH"])
@token_required
def patch_cart(current_user_id, cart_id):
    data = request.get_json() or {}
    count = data.get("count")
    if count is None:
        return jsonify({"message": "count is required"}), 400
# 내 cart가 아니라면 cart_id가 존재해도 못찾게 막음 (보안)
# A 유저의 cart_id = 5, B 유저가 URL을 바꿔서 요청 → B가 A의 장바구니 수정 / 삭제 가능
    item = Cart.query.filter_by(id=cart_id, user_id=current_user_id).first()
    if not item:
        return jsonify({"message": "Cart item not found"}), 404

# 수량 최소 1
    item.count = max(1, int(count))
    db.session.commit()
    return jsonify({"id": item.id, "product_id": item.product_id, "count": item.count}), 200

# 장바구니 상품 삭제
@bp.route("/<int:cart_id>", methods=["DELETE"])
@token_required
def delete_cart(current_user_id, cart_id):
    item = Cart.query.filter_by(id=cart_id, user_id=current_user_id).first()
    if not item:
        return jsonify({"message": "Cart item not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200