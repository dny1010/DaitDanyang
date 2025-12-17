# back/seed.py
from datetime import datetime
from app import create_app
from petShop.models import db, Product, Question, User

app = create_app()

with app.app_context():
    # ✅ 삭제 순서: FK 때문에 Question 먼저 지우는 게 안전
    db.session.query(Question).delete()
    db.session.query(Product).delete()
    db.session.query(User).delete()
    db.session.commit()
    print("🗑 기존 데이터 전체 삭제 완료")

    # ✅ 1) 질문 작성자(공지 작성자) 유저 생성
    admin = User(
        user_id="admin",
        password="1234",
        nickname="관리자",
        email="admin@example.com",
    )
    db.session.add(admin)
    db.session.commit()  # ✅ admin.id 생성되게 먼저 commit/flush
    # (commit 대신 db.session.flush() 해도 됨)

    feed1 = [
        Product(
            title="[몰리스] 미니 참치와도미 30g 6입 고양이습식캔",
            price=3360,
            img_url="/DAITDANYANG/cat/간식/[몰리스] 미니 참치와도미 30g 6입 고양이습식캔.jpg",
            category="간식",
            pet_type="cat",
        ),
        Product(
            title="내추럴키티 100% 원재료 리얼스낵 고양이 간식 참치 뱃살, 30g, 1개",
            price=3650,
            img_url="/DAITDANYANG/cat/간식/내추럴키티 100% 원재료 리얼스낵 고양이 간식 참치 뱃살, 30g, 1개.jpg",
            category="간식",
            pet_type="cat",
        ),
        Product(
            title="누심비 고양이 간식 짜먹는 대용량 15g 벌크 1p 습식 참치 맛 길고양이간식",
            price=180,
            img_url="/DAITDANYANG/cat/간식/누심비 고양이 간식 짜먹는 대용량 15g 벌크 1p 습식 참치 맛 길고양이간식.jpg",
            category="간식",
            pet_type="cat",
        ),
    ]

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

    db.session.add_all(feed1)
    db.session.add_all(question1)
    db.session.commit()
    print("✅ Product + Question 시드 완료!")
