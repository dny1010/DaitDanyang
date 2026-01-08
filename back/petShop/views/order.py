from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from petShop.models import Order, User

order_bp = Blueprint('order', __name__, url_prefix='/api/orders')

@order_bp.route('', methods=['GET'])
@jwt_required()
def list_orders():

    current_user = get_jwt_identity()
    orders = Order.query.filter_by(user_id=current_user).order_by(Order.ordered_date.desc()).all()

    result = []
    for o in orders:
        p= o.product
        totalPrice = p.price * o.count
        result.append({
            "orderId": o.id,
            "ordered_date": o.ordered_date.strftime("%Y-%m-%d"),
            "items": [{
                "id": o.id,
                "product_id": p.id if p else None,
                "img_url": p.imgUrl,
                "title": p.title,
                "price": totalPrice,
            }]
        })
    return jsonify(result)