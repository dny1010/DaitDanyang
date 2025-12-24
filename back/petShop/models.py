from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.types import JSON
from datetime import datetime

db = SQLAlchemy()


# ============================================
# 1. User & Address (회원 + 여러 배송지)
# ============================================
class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)

    # 로그인 아이디
    user_id = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

    nickname = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    # 기본 배송지 (선택 사항)
    default_address = db.Column(db.String(255), nullable=True)

    phone = db.Column(db.String(20), unique=True, nullable=True)

    # ✅ 선호 반려동물 (다중 선택 가능) ex) ["dog", "cat"]
    pet_list = db.Column(JSON, nullable=True)


class Address(db.Model):
    """
    유저가 저장해 두는 여러 배송지 (집, 회사, 부모님댁 등)
    주문할 때 여기서 하나 선택하거나, 새 주소 입력해서 추가 저장
    """
    __tablename__ = 'address'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id', ondelete='CASCADE'),
        nullable=False
    )
    user = db.relationship(
        'User',
        backref=db.backref('addresses', lazy=True)
    )

    # 주소 이름 (집, 회사 같은 라벨)
    label = db.Column(db.String(50), nullable=True)

    full_address = db.Column(db.String(255), nullable=False)

    # 기본 배송지 여부
    is_default = db.Column(db.Boolean, nullable=False, default=False)


# ============================================
# 2. Product (펫 상품)
# ============================================
class Product(db.Model):
    __tablename__ = 'product'

    id = db.Column(db.Integer, primary_key=True)

    # 상품명
    title = db.Column(db.String(200), nullable=False)

    # 상품 설명
    content = db.Column(db.Text, nullable=True)

    # 가격 (원 단위 정수)
    price = db.Column(db.Integer, nullable=False)

    # 대표 이미지 경로 또는 URL
    img_url = db.Column(db.String(255), nullable=True)

    # 상품 카테고리 (사료, 간식, 장난감, 용품 등)
    category = db.Column(db.String(50), nullable=True)

    # 상품 카테고리 (사료, 간식, 장난감, 용품 등)
    sub_category = db.Column(db.String(50), nullable=True)

    # 대상 동물 (cat, dog, etc)
    pet_type = db.Column(db.String(10), nullable=True)

    # 조회수
    views = db.Column(db.Integer, nullable=False, default=0)

    # 재고 수량
    stock = db.Column(db.Integer, nullable=False, default=0)

    # 리뷰 개수 (리뷰 작성 시 증가)
    review_count = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "price": self.price,

            # 프론트가 item.imgUrl을 쓰고 있으니 imgUrl 키로 내려줌
            "imgUrl": self.img_url,

            "category": self.category,
            "sub_category": self.sub_category,
            "pet_type": self.pet_type,

            "views": self.views,
            "stock": self.stock,
            "review_count": self.review_count,
        }

# ============================================
# 3. QnA (문의 게시판)
# ============================================
class Question(db.Model):
    """
    상품 문의, 이벤트 문의, 일반 문의 등
    """
    __tablename__ = 'question'

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)

    # 예: "상품문의", "이벤트", "건의사항" 등
    category = db.Column(db.String(50), nullable=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id', ondelete='CASCADE'),
        nullable=False
    )
    user = db.relationship(
        'User',
        backref=db.backref('questions', lazy=True)
    )

    content = db.Column(db.Text, nullable=False)

    created_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    modified_date = db.Column(db.DateTime, nullable=True)

    img_url = db.Column(db.String(255), nullable=True)


class Answer(db.Model):
    """
    관리자 또는 스태프가 남기는 답변
    """
    __tablename__ = 'answer'

    id = db.Column(db.Integer, primary_key=True)

    question_id = db.Column(
        db.Integer,
        db.ForeignKey('question.id', ondelete='CASCADE'),
        nullable=False
    )
    question = db.relationship(
        'Question',
        backref=db.backref('answers', lazy=True)
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id', ondelete='CASCADE'),
        nullable=False
    )
    user = db.relationship(
        'User',
        backref=db.backref('answers', lazy=True)
    )

    title = db.Column(db.String(200), nullable=True)
    content = db.Column(db.Text, nullable=False)

    created_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    modified_date = db.Column(db.DateTime, nullable=True)

    img_url = db.Column(db.String(255), nullable=True)


# ============================================
# 4. Cart (장바구니)
# ============================================
class Cart(db.Model):
    __tablename__ = 'cart'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id', ondelete='CASCADE'),
        nullable=False
    )
    user = db.relationship(
        'User',
        backref=db.backref('carts', lazy=True)
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey('product.id', ondelete='CASCADE'),
        nullable=False
    )
    product = db.relationship(
        'Product',
        backref=db.backref('carts', lazy=True)
    )

    # 장바구니에 담긴 수량
    count = db.Column(db.Integer, nullable=False, default=1)


# ============================================
# 5. Order (주문)
# ============================================
class Order(db.Model):
    __tablename__ = 'order'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id', ondelete='SET NULL'),
        nullable=True
    )
    user = db.relationship(
        'User',
        backref=db.backref('orders', lazy=True)
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey('product.id', ondelete='SET NULL'),
        nullable=True
    )
    product = db.relationship(
        'Product',
        backref=db.backref('orders', lazy=True)
    )

    # 주문 수량
    count = db.Column(db.Integer, nullable=False, default=1)

    # ✅ 주문 당시 최종 배송 주소 (문자열로 복사해서 저장)
    order_address = db.Column(db.String(255), nullable=False)

    # 주문 당시 사용한 연락처 (옵션)
    order_phone = db.Column(db.String(20), nullable=True)
    ordered_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

# ============================================
# 6. Reviews (상품 리뷰)
# ============================================
class Review(db.Model):
    __tablename__ = 'review'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id', ondelete='CASCADE'),
        nullable=False
    )
    user = db.relationship(
        'User',
        backref=db.backref('reviews', lazy=True)
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey('product.id', ondelete='CASCADE'),
        nullable=False
    )
    product = db.relationship(
        'Product',
        backref=db.backref('reviews', lazy=True)
    )

    # 리뷰 내용
    content = db.Column(db.Text, nullable=False)

    img_url = db.Column(db.String(255), nullable=True)

    # 평점 (1~5점 등)
    rating = db.Column(db.Integer, nullable=False)

    create_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

# ============================================
# 7. pet (내가 키우는 동물에 대한 정보)
# ============================================

class Pet(db.Model):
    __tablename__ = 'pet'

    id = db.Column(db.Integer, primary_key=True)

    # 어떤 유저의 펫인지
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id', ondelete='CASCADE'),
        nullable=False
    )
    user = db.relationship(
        'User',
        backref=db.backref('pets', lazy=True)
    )

    # 펫 이름
    name = db.Column(db.String(50), nullable=False)

    # 동물 종류 (dog, cat, etc)
    pet_type = db.Column(db.String(20), nullable=False)

    # 이 펫의 성별 / 생일
    gender = db.Column(db.String(10), nullable=True)
    birthday = db.Column(db.Date, nullable=True)

    # 선택: 품종, 몸무게 등 추가 가능
    breed = db.Column(db.String(50), nullable=True)
    weight = db.Column(db.Float, nullable=True)
