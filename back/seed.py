# back/seed.py
import os
import json
from datetime import datetime
import random

from app import create_app
from petShop.models import db, Product, Question, User, Review

# ✅ crawlers/data 경로
BASE_DATA_DIR = os.path.join(
    os.path.dirname(__file__),
    "data"
)

app = create_app()

with app.app_context():
    # =========================================================
    # 0️⃣ 기존 데이터 전체 삭제 (FK 고려 순서)
    # =========================================================
    db.session.query(Question).delete()
    db.session.query(Product).delete()
    db.session.query(User).delete()
    db.session.commit()
    print("🗑 기존 데이터 전체 삭제 완료")

    # =========================================================
    # 1️⃣ 관리자(admin) 유저 생성
    # =========================================================
    admin = User(
        user_id="admin",
        password="1234",
        nickname="관리자",
        email="admin@example.com",
        role="admin",
    )
    db.session.add(admin)
    db.session.flush()  # ✅ admin.id 확보 (commit 대신 flush)
    print("👤 관리자 계정 생성 완료")

    # =========================================================
    # 2️⃣ 공지사항(Question) 생성
    # =========================================================
    question1 = [
        Question(
            title="[배송공지] 설 연휴 배송 안내",
            category="공지사항",
            user_id=admin.id,  # ✅ 핵심: NOT NULL 해결
            content=(
                "안녕하세요, 다잇다냥입니다.\n"
                "설 연휴 기간 배송 및 고객센터 운영 일정에 대해 안내해 드립니다.\n\n"
                "1. 배송 안내\n"
                "  ▶ 2월 12일 (목) 17시 이전 결제 완료건 : 당일 출고 및 연휴 전 수령 가능\n"
                "    (일부 지역은 연휴 전 수령이 어려울 수 있습니다)\n"
                "  ▶ 2월 12일 (목) 17시 이후 결제 완료건 : 2월 19일 (목)부터 순차 출고,\n"
                "    2월 20일(금)부터 순차 수령 가능\n\n"
                "＊ 제주도, 도서산간 지역 및 업체배송은 1~3일 가량 일찍 마감됩니다.\n\n"
                "2. 고객센터 이용 안내\n"
                "  ▶ 휴무 기간 : 2월 13일(금) ~ 2월 19일(목)까지 휴무\n"
                "  ▶ 연휴 기간 내 궁금하신 사항은 내 정보 > 1:1 게시판을 이용해 주세요.\n\n"
                "설 연휴 전후 물량증가로 인해 배송지연이 예상되오니 너그러이 양해 부탁드립니다.\n"
                "가족과 함께 즐거운 설연휴 보내시기 바랍니다.\n"
                "감사합니다."
            ),
            created_date=datetime(2026, 1, 14),
        ),
        Question(
            title="[배송공지] 연말 연시 배송 안내",
            category="공지사항",
            user_id=admin.id,  # ✅ 핵심: NOT NULL 해결
            content=(
                "안녕하세요, 다잇다냥입니다.\n"
                "연말 및 새해 연휴 기간 배송 및 고객센터 운영 일정에 대해 안내해 드립니다.\n\n"
                "1. 배송 안내\n"
                "  ▶ 12월 30일 (화) 17시 이전 결제 완료건 : 당일 출고 및 31일 수령 가능\n"
                "    (일부 지역은 연휴 전 수령이 어려울 수 있습니다)\n"
                "  ▶ 12월 30일 (목) 17시 이후 결제 완료건 : 1월 2일 (금)부터 순차 출고,\n"
                "    1월 3일(토)부터 순차 수령 가능\n\n"
                "＊ 제주도, 도서산간 지역 및 업체배송은 1~3일 가량 일찍 마감됩니다.\n\n"
                "2. 고객센터 이용 안내\n"
                "  ▶ 휴무 기간 : 12월 31일(수) ~ 1월 1일(목)까지 휴무\n"
                "  ▶ 연휴 기간 내 궁금하신 사항은 내 정보 > 1:1 게시판을 이용해 주세요.\n\n"
                "즐거운 연말 보내시고 새해 복 많이 받으세요.\n"
                "감사합니다."
            ),
            created_date=datetime(2025, 12, 16),
        ),
        Question(
            title="[배송공지] 성탄절 배송공지",
            category="공지사항",
            user_id=admin.id,  # ✅ 핵심: NOT NULL 해결
            content=(
                "안녕하세요, 다잇다냥입니다.\n"
                "12월 25일은 성탄절로 인한 공휴일로 택배사에서 배송 업무를 하지 않습니다.\n"
                "따라서 12월 24일 출고된 상품은 12월 29일부터 순차 수령 가능하오니 주문 시 참고 부탁 드립니다.\n"
                "그럼 즐거운 성탄절 보내시기 바랍니다.\n"
                "감사합니다."
            ),
            created_date=datetime(2025, 12, 5),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,  # ✅ 핵심: NOT NULL 해결
            content=(
                "안녕하세요, 다잇다냥입니다.\n"
                "2025년 11월 10일(월) 부터 출고 마감 시간이 변경되어 안내드립니다.\n\n"
                "- 발송 마감\n"
                "평일 : 오후 5시 까지 결제 완료 시 당일 출고 (평일 5시 30분 => 평일 5시 변경)\n"
                "토요일 : 오후 12시 까지 결제 완료 시 당일 출고 (기존 동일)\n\n"
                "보다 안전하고 정호가한 배송을 위하여 마감 시간을 변경하게 되었사오니 참고 부탁 드립니다.\n"
                "앞으로도 보다 나은 서비스를 제공할 수 있도록 노력하겠습니다.\n"
                "감사합니다."
            ),
            created_date=datetime(2025, 11, 14),
        ),




    ]

    review1 = [
        Review(
            user_id= admin.id,
            product_id = 580,
            content = "너무 좋아요",
            img_url = "https://shopping-phinf.pstatic.net/main_5294012/52940129003.1.jpg",
            rating = 5,
            create_date=datetime(2026,1,7)
        )
    ]

    db.session.add_all(question1+review1)
    print("📢 공지사항 생성 완료")

    # =========================================================
    # 3️⃣ JSON 파일 순회 → Product 생성
    # =========================================================
    products_to_add = []
    count = 0

    if not os.path.exists(BASE_DATA_DIR):
        raise FileNotFoundError(f"❌ 데이터 폴더 없음: {BASE_DATA_DIR}")

    for root, dirs, files in os.walk(BASE_DATA_DIR):
        for filename in files:
            if not filename.endswith(".json"):
                continue

            file_path = os.path.join(root, filename)

            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)

                # ✅ pet_type 추론 (data/dog | data/cat | data/other)
                rel_path = os.path.relpath(file_path, BASE_DATA_DIR)
                path_parts = rel_path.split(os.sep)

                pet_type = "dog"
                if path_parts[0] in ("dog", "cat", "other"):
                    pet_type = path_parts[0]

                # ✅ category 정리 ("강아지_사료" → "사료")
                raw_cat = data.get("main_category", "기타")
                category = raw_cat.split("_")[-1] if "_" in raw_cat else raw_cat
                sub_category = data.get("sub_category", "")
                title = data.get("re_title")
                product = Product(
                    title=title,
                    content=f"브랜드: {data.get('brand','')}\n제조사: {data.get('maker','')}",
                    price=int(data.get("lprice", 0) or 0),
                    img_url=data.get("image", ""),
                    category=category,
                    sub_category=sub_category,
                    pet_type=pet_type,
                    stock=100,
                    views=random.randint(100, 1000),
                    review_count=0,
                )


                products_to_add.append(product)
                count += 1

            except Exception as e:
                print(f"❌ JSON 처리 실패: {file_path} → {e}")

    if products_to_add:
        db.session.add_all(products_to_add)
        db.session.commit()
        print(f"✅ 총 {count}개 Product 시드 완료")
    else:
        db.session.commit()

    print("🎉 Product + Question + Admin 시드 완료!")
