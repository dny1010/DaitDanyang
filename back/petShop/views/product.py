from flask import Blueprint, request, jsonify
from petShop.models import Product, Review

product_bp = Blueprint('product', __name__, url_prefix='/api/product')

@product_bp.get("")
def list_products():
    pet_type = request.args.get('pet_type')
    categories = request.args.getlist('category')
    page = request.args.get('page',default=1, type=int)
    limit = request.args.get('limit',default=12, type=int)
    sort = request.args.get('sort',default='id_desc',type=str)
    # 추가한이유 프론트에서 필터링한 네임들이 매칭이 되질않아 db의 네임과 맞게 매칭 하던중
    # 같은 카테고리에 들어가야하는 물건들을 발견 그 물건들을 한곳에 넣기위해 리스트화 하였고 그것을 받기위해
    # category[]로 보내라고 하였더니 category와 category[]가 공존 category[]를 읽지못하는 상황이 발생하여
    # category[]를 읽는 코드를 작성
    # 내가 받아오는 값이 category[]이면 category[]를 키값으로 다시 집어넣고 값을 받아라
    if not categories:
        categories = request.args.getlist('category[]')
    # 페이지 최소값 1로 지정
    page = max(page, 1)
    # limit max제한
    limit = max(1, min(limit, 50))



    q = Product.query

    if pet_type:
        q = q.filter(Product.pet_type == pet_type)
    if categories:
        q = q.filter(Product.category.in_(categories))


    # desc : 큰 값 → 작은 값 (내림차순), asc : 작은 값 → 큰 값 (오름차순)

    if sort == "price_asc":
        q = q.order_by(Product.price.asc())
    elif sort == "price_desc":
        q = q.order_by(Product.price.desc())
    elif sort == "views_desc":
        q = q.order_by(Product.views.desc())
    elif sort == "review_count_desc":
        q = q.order_by(Product.review_count.desc())
    # 기본 정렬
    else:
        q = q.order_by(Product.id.desc())

    # sort 값은 한번에 하나만 적용해야하기때문에 if를 쓴다

    total = q.order_by(None).count()
    #위에서 한 정렬때문에 오더바이가 들어가있어 그걸 빼기위해 none를 넣는다
    items = q.offset((page-1)*limit).limit(limit).all()
    # (page-1)*limit) 현 페이지 X 내가 페이지당 나오게한 상품수
    # limit(limit) 그 이후 상품
    # 지금까지 나온 상품은 빼고 그 뒤의 상품정보만 가져와라

    ids = request.args.get("ids")
    if ids:
        id_list = [int(x) for x in ids.split(",") if x.isdigit()]
        products = Product.query.filter(Product.id.in_(id_list)).all()

        by_id = {p.id: p for p in products}
        items = [{
            "id": p.id,
            "title": p.title,
            "price": p.price,
            "img_url": p.img_url
        } for i in id_list if (p := by_id.get(i))]

        return jsonify({"items": items}), 200

    return jsonify({
        "items": [p.to_dict() for p in items],
        "page": page,
        "limit": limit,
        "total": total,
    })
    # [p.to_dict() for p in items] 의 뜻은
    # Product 객체 리스트(items)를 하나씩 꺼내서(p),
    # 각각 dict로 바꾼 다음, 그 dict들로 새 리스트를 만들어라.
    # EX: { "id": 1, "title": "강아지 사료", "price": 12000, "pet_type": "dog" },


@product_bp.get("/<int:product_id>")
def product_detail(product_id):
    p = Product.query.get_or_404(product_id)
    review_count = Review.query.filter_by(product_id=product_id).count()

    data = p.to_dict()
    data['review_count'] = review_count
    return jsonify(data)
