import requests
import time
import random
import os
import json
import re
from app import create_app
from petShop.models import db, Product

# 네이버 쇼핑 API 설정
CLIENT_ID = "pc_zww65jRtKpd0W3PWx"
CLIENT_SECRET = "1XIUlQYx6W"

# 데이터 저장 루트 폴더
DATA_ROOT = "crawled_data"

# 카테고리 및 검색어 설정
CATEGORIES = {
    "사료": {
        "육류_1-3kg": {"keyword": "강아지 사료 육류 1kg", "count": 4},
        "육류_3-5kg": {"keyword": "강아지 사료 육류 3kg", "count": 4},
        "육류_5-10kg": {"keyword": "강아지 사료 육류 5kg", "count": 4},
        "어류_1-3kg": {"keyword": "강아지 사료 연어 1kg", "count": 4},
        "어류_3-5kg": {"keyword": "강아지 사료 연어 3kg", "count": 4},
        "어류_5-10kg": {"keyword": "강아지 사료 연어 5kg", "count": 4},
        "갑각류_모음": {"keyword": "강아지 사료 새우 관절", "count": 5},
        "과일야채": {"keyword": "강아지 채식 사료", "count": 5},
    },
    "간식": {
        "껌": {"keyword": "강아지 껌", "count": 20},
        "육포": {"keyword": "강아지 육포", "count": 20},
        "캔": {"keyword": "강아지 캔 간식", "count": 20},
        "쿠키": {"keyword": "강아지 쿠키", "count": 20},
        "소시지": {"keyword": "강아지 소시지", "count": 20},
        "동결건조": {"keyword": "강아지 동결건조 간식", "count": 20},
        "영양공급": {"keyword": "강아지 영양제 간식", "count": 20},
    },
    "위생": {
        "배변패드": {"keyword": "강아지 배변패드", "count": 20},
        "배변판": {"keyword": "강아지 배변판", "count": 20},
        "기저귀": {"keyword": "강아지 기저귀", "count": 20},
        "탈취소독": {"keyword": "강아지 탈취제", "count": 20},
        "배변봉투": {"keyword": "강아지 배변봉투", "count": 20},
        "물티슈": {"keyword": "강아지 물티슈", "count": 20},
        "배변유도제": {"keyword": "강아지 배변유도제", "count": 10},
    },
    "미용": {
        "샴푸린스": {"keyword": "강아지 샴푸", "count": 20},
        "에센스": {"keyword": "강아지 에센스", "count": 20},
        "브러쉬": {"keyword": "강아지 브러쉬", "count": 20},
        "미용가위": {"keyword": "강아지 미용가위", "count": 20},
        "발톱": {"keyword": "강아지 발톱깎이", "count": 20},
        "눈귀관리": {"keyword": "강아지 귀세정제", "count": 20},
        "구강관리": {"keyword": "강아지 치약 칫솔", "count": 20},
        "타올": {"keyword": "강아지 목욕 타올", "count": 20},
        "펫드라이": {"keyword": "강아지 드라이룸", "count": 10},
    },
    "식기": {
        "식기": {"keyword": "강아지 밥그릇", "count": 20},
        "정수기": {"keyword": "강아지 정수기", "count": 20},
        "자동급식기": {"keyword": "강아지 자동급식기", "count": 20},
    },
    "하우스": {
        "하우스": {"keyword": "강아지 집", "count": 20},
        "방석매트": {"keyword": "강아지 방석", "count": 20},
        "계단": {"keyword": "강아지 계단", "count": 20},
        "철장안전문": {"keyword": "강아지 울타리", "count": 20},
    },
    "이동장": {
        "이동가방": {"keyword": "강아지 이동가방", "count": 20},
        "유모차": {"keyword": "강아지 유모차", "count": 20},
        "차량용": {"keyword": "강아지 카시트", "count": 20},
    },
    "건강관리": {
        "종합비타민": {"keyword": "강아지 종합비타민", "count": 20},
        "피부모발": {"keyword": "강아지 피부영양제", "count": 20},
        "뼈칼슘": {"keyword": "강아지 관절영양제", "count": 20},
        "눈귀구강": {"keyword": "강아지 눈영양제", "count": 20},
        "장소화": {"keyword": "강아지 유산균", "count": 20},
        "해충방지": {"keyword": "강아지 해충방지", "count": 20},
    },
    "의류": {
        "원피스": {"keyword": "강아지 원피스", "count": 20},
        "티셔츠": {"keyword": "강아지 티셔츠", "count": 20},
        "신발": {"keyword": "강아지 신발", "count": 20},
        "모자": {"keyword": "강아지 모자", "count": 20},
    },
    "산책용품": {
        "목줄": {"keyword": "강아지 목줄", "count": 20},
        "하네스": {"keyword": "강아지 하네스", "count": 20},
        "리드줄": {"keyword": "강아지 리드줄", "count": 20},
        "이름표": {"keyword": "강아지 이름표", "count": 20},
    },
    "장난감": {
        "봉제": {"keyword": "강아지 봉제인형", "count": 20},
        "치실": {"keyword": "강아지 터그놀이", "count": 20},
        "공원반": {"keyword": "강아지 공 장난감", "count": 20},
        "노즈워크": {"keyword": "강아지 노즈워크", "count": 20},
    }
}

def clean_filename(s):
    """파일명으로 사용할 수 없는 문자 제거"""
    s = str(s).strip().replace(' ', '_')
    return re.sub(r'(?u)[^-\w.]', '', s)

def crawl_naver_shopping(keyword, display_count=10):
    url = "https://openapi.naver.com/v1/search/shop.json"
    headers = {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET
    }
    params = {
        "query": keyword,
        "display": display_count,
        "sort": "sim"
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json().get('items', [])
    except Exception as e:
        print(f"Error crawling {keyword}: {e}")
        return []

def download_image(url, save_path):
    try:
        res = requests.get(url, timeout=10)
        if res.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(res.content)
            return True
    except Exception as e:
        print(f"이미지 다운로드 실패 ({url}): {e}")
    return False

def save_data(items, category_main, category_sub):
    # 폴더 생성
    dir_path = os.path.join(DATA_ROOT, category_main, category_sub)
    os.makedirs(dir_path, exist_ok=True)

    for idx, item in enumerate(items):
        # 1. 데이터 정제
        title = item['title'].replace('<b>', '').replace('</b>', '')
        raw_desc = item.get('description', '')
        clean_desc = raw_desc.replace('<b>', '').replace('</b>', '') if raw_desc else ""
        
        try:
            price = int(item['lprice'])
        except:
            price = 0
            
        img_url = item['image']
        
        # 2. 파일 저장 (이미지 + JSON)
        # 파일명 생성 (인덱스_상품명앞부분)
        short_title = clean_filename(title)[:20]
        file_base = f"{idx+1}_{short_title}"
        
        # 이미지 저장
        img_filename = f"{file_base}.jpg"
        img_save_path = os.path.join(dir_path, img_filename)
        download_success = download_image(img_url, img_save_path)
        
        # 메타데이터(JSON) 저장
        meta_data = {
            "title": title,
            "description": clean_desc,
            "price": price,
            "category": f"{category_main} - {category_sub}",
            "pet_type": "dog",
            "image_url": img_url,
            "local_image_path": img_save_path if download_success else None,
            "stock": random.randint(10, 100),
            "views": random.randint(0, 50)
        }
        
        json_filename = f"{file_base}.json"
        with open(os.path.join(dir_path, json_filename), 'w', encoding='utf-8') as f:
            json.dump(meta_data, f, ensure_ascii=False, indent=4)

        # 3. DB 저장 (기존 로직 유지)
        # 중복 체크
        existing = Product.query.filter_by(img_url=img_url).first()
        if not existing:
            new_product = Product(
                title=title,
                content=clean_desc,
                price=price,
                img_url=img_url,
                category=f"{category_main} - {category_sub}",
                pet_type="dog",
                stock=meta_data['stock'],
                views=meta_data['views'],
                review_count=0
            )
            db.session.add(new_product)
    
    try:
        db.session.commit()
    except Exception as e:
        print(f"DB Commit Error: {e}")
        db.session.rollback()

def main():
    app = create_app()
    with app.app_context():
        # 폴더 초기화 알림
        if not os.path.exists(DATA_ROOT):
            os.makedirs(DATA_ROOT)
            print(f"Folder '{DATA_ROOT}' created.")

        print("--- Naver Shopping API Crawling Start (File + DB) ---")
        
        for main_cat, sub_cats in CATEGORIES.items():
            for sub_cat, info in sub_cats.items():
                keyword = info['keyword']
                count = info['count']
                
                print(f"Crawling: [{main_cat} - {sub_cat}] Keyword: {keyword}")
                
                items = crawl_naver_shopping(keyword, count)
                if items:
                    save_data(items, main_cat, sub_cat)
                    print(f"   -> Processed {len(items)} items.")
                else:
                    print("   -> No items found or error.")
                
                time.sleep(0.5) 

        print("--- All Done ---")

if __name__ == "__main__":
    main()