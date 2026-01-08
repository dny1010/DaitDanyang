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
            user_id=admin.id,
            content=(
                "안녕하세요, 다잇다냥입니다.\n"
                "설 연휴 기간 배송 및 고객센터 운영 일정에 대해 안내해 드립니다.\n\n"
                "1. 배송 안내\n"
                "▶ 2월 12일 17시 이전 결제 : 당일 출고\n"
                "▶ 2월 12일 17시 이후 결제 : 2월 19일부터 순차 출고\n\n"
                "감사합니다."
            ),
            created_date=datetime(2026, 1, 14),
        ),
        Question(
            title="[배송공지] 연말 연시 배송 안내",
            category="공지사항",
            user_id=admin.id,
            content="연말 및 새해 연휴 배송 일정 안내드립니다.",
            created_date=datetime(2025, 12, 16),
        ),
        Question(
            title="[배송공지] 성탄절 배송공지",
            category="공지사항",
            user_id=admin.id,
            content="12월 25일 성탄절로 택배 배송이 중단됩니다.",
            created_date=datetime(2025, 12, 5),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),

        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
            created_date=datetime(2025, 11, 14),
        ),
        Question(
            title="택배 출고 마감시간 변경 안내",
            category="공지사항",
            user_id=admin.id,
            content="출고 마감 시간이 오후 5시로 변경되었습니다.",
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
