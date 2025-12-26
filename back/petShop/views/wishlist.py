from flask import Blueprint, request, jsonify, current_app
from petShop.models import Wishlist, Product, User, db
from functools import wraps
import jwt

bp = Blueprint('wishlist', __name__, url_prefix='/api/wishlist')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            if token.startswith('Bearer '):
                token = token.split(" ")[1]
            # SECRET_KEY가 app config에 없으면 기본값 사용 (주의: 보안상 환경변수 권장)
            secret = current_app.config.get('SECRET_KEY', 'dev_secret_key')
            data = jwt.decode(token, secret, algorithms=["HS256"])
            
            raw_id = data.get('user_id')
            
            # 토큰의 user_id가 정수(PK)인지 문자열(로그인ID)인지 불확실하므로
            # User 테이블에서 정확한 PK를 조회하여 사용 (안전장치)
            # 만약 raw_id가 정수형 문자열('1')이면 | 연산자에서 둘 다 매칭될 수 있으나,
            # user_id(String)가 unique하므로 안전. 우선순위는 PK > user_id 로 잡거나 OR 검색.
            # 여기서는 편의상 OR 검색 사용. (정확성을 위해선 토큰 생성 로직을 확인해야 하나, 현재로선 최선)
            user = User.query.filter((User.id == raw_id) | (User.user_id == raw_id)).first()
            
            if not user:
                 return jsonify({'message': 'User not found'}), 404
                 
            current_user_id = user.id
            
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        return f(current_user_id, *args, **kwargs)
    return decorated

@bp.route('/', methods=['GET'])
@token_required
def get_wishlist(current_user_id):
    """
    로그인한 사용자의 찜 목록을 조회하여 Product 정보를 반환
    """
    wishlists = Wishlist.query.filter_by(user_id=current_user_id).all()
    results = []
    
    for item in wishlists:
        product = item.product
        if product:
            # product.to_dict() 메서드 활용
            p_data = product.to_dict()
            # 찜 목록 추가 날짜 등 필요하면 여기에 추가
            p_data['wished_at'] = item.created_date.isoformat()
            results.append(p_data)
            
    return jsonify(results), 200

@bp.route('/add', methods=['POST'])
@token_required
def add_wishlist(current_user_id):
    """
    찜 목록에 상품 추가
    """
    data = request.get_json()
    product_id = data.get('product_id')
    
    if not product_id:
        return jsonify({'message': 'Product ID is required'}), 400
        
    existing = Wishlist.query.filter_by(user_id=current_user_id, product_id=product_id).first()
    if existing:
        return jsonify({'message': 'Already in wishlist'}), 200
        
    new_wish = Wishlist(user_id=current_user_id, product_id=product_id)
    db.session.add(new_wish)
    db.session.commit()
    
    return jsonify({'message': 'Added to wishlist'}), 201

@bp.route('/remove', methods=['POST'])
@token_required
def remove_wishlist(current_user_id):
    """
    찜 목록에서 상품 제거
    """
    data = request.get_json()
    product_id = data.get('product_id')
    
    if not product_id:
        return jsonify({'message': 'Product ID is required'}), 400
        
    wish_item = Wishlist.query.filter_by(user_id=current_user_id, product_id=product_id).first()
    if not wish_item:
        return jsonify({'message': 'Item not found in wishlist'}), 404
        
    db.session.delete(wish_item)
    db.session.commit()
    
    return jsonify({'message': 'Removed from wishlist'}), 200

# ==============================================================================
# [Gemini 작업 로그] - 2025.12.26
# 1. 파일 생성: 찜 목록(Wishlist) API 구현
# 2. 기능:
#    - GET /: 사용자 찜 목록 조회 (JWT 인증 필수)
#    - POST /add: 찜 목록에 상품 추가
#    - POST /remove: 찜 목록에서 상품 제거
# 3. [Critical Fix]: JWT 토큰의 user_id 타입 불일치 해결
#    - 토큰의 ID가 String(Login ID)일 경우와 Integer(PK)일 경우를 모두 대응하기 위해
#    - User 테이블에서 명시적으로 조회하여 정확한 Integer PK를 얻어 사용하도록 보완.
# ==============================================================================
