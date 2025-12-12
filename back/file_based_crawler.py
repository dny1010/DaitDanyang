import requests
import os
import time
import re

# --- 설정 ---
CLIENT_ID = "_TF3O7N2mhW6Kshn8AkL"
CLIENT_SECRET = "U7JdLSdXVs"
NAVER_API_URL = "https://openapi.naver.com/v1/search/shop.json"
BASE_SAVE_PATH = os.path.join(os.path.dirname(__file__), 'crawled_data', 'cat')
os.makedirs(BASE_SAVE_PATH, exist_ok=True)

# --- 전체 13개 카테고리 작업 목록 ---
TASKS = [
    {'category': '사료', 'query': '고양이 사료'},
    {'category': '캔', 'query': '고양이 캔'},
    {'category': '간식', 'query': '고양이 간식'},
    {'category': '모래', 'query': '고양이 모래'},
    {'category': '화장실', 'query': '고양이 화장실'},
    {'category': '미용_목욕', 'query': '고양이 미용'},
    {'category': '급식기_급수기', 'query': '고양이 급식기'},
    {'category': '하우스', 'query': '고양이 하우스'},
    {'category': '스크래쳐_캣타워', 'query': '고양이 스크래쳐'},
    {'category': '이동장', 'query': '고양이 이동장'},
    {'category': '건강관리', 'query': '고양이 영양제'},
    {'category': '의류', 'query': '고양이 옷'},
    {'category': '장난감', 'query': '고양이 장난감'},
]
# --- 작업 목록 끝 ---

def get_api_results(query, display, start):
    headers = {"X-Naver-Client-Id": CLIENT_ID, "X-Naver-Client-Secret": CLIENT_SECRET}
    params = {"query": query, "display": display, "start": start, "sort": "sim"}
    try:
        response = requests.get(NAVER_API_URL, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"  [API 호출 오류: {e}]")
        return None

def save_product_files(item, category_path):
    title = item.get('title', '제목없음').replace('<b>', '').replace('</b>', '')
    safe_title = re.sub(r'[\\/*?:\"<>|]', "", title)[:50]
    filename_base = os.path.join(category_path, safe_title)

    metadata_path = f"{filename_base}.txt"
    try:
        with open(metadata_path, 'w', encoding='utf-8') as f:
            f.write(f"상품명: {title}\n")
            f.write(f"최저가: {item.get('lprice', '정보없음')}\n")
            f.write(f"브랜드: {item.get('brand', '정보없음')}\n")
            f.write(f"제조사: {item.get('maker', '정보없음')}\n")
            f.write(f"판매 쇼핑몰: {item.get('mallName', '정보없음')}\n")
            f.write(f"상품 ID: {item.get('productId', '정보없음')}\n")
            f.write(f"상품 링크: {item.get('link', '정보없음')}\n")
            f.write(f"이미지 URL: {item.get('image', '정보없음')}\n")
    except Exception as e:
        print(f"    -> .txt 파일 저장 오류: {e}")
        return

    image_url = item.get('image')
    if not image_url:
        return
        
    image_path = f"{filename_base}.jpg"
    try:
        image_response = requests.get(image_url)
        image_response.raise_for_status()
        with open(image_path, 'wb') as f:
            f.write(image_response.content)
    except Exception as e:
        print(f"    -> 이미지 다운로드 오류: {e}")

def main():
    print("--- API 기반 전체 카테고리 크롤러 시작 ---")
    total_saved_count = 0
    
    for i, task in enumerate(TASKS):
        query = task['query']
        category = task['category']
        target_count = 20
        print(f"\n--- 작업 {i+1}/{len(TASKS)} 시작: [{category}] (목표: {target_count}개) ---")
        
        category_path = os.path.join(BASE_SAVE_PATH, category)
        os.makedirs(category_path, exist_ok=True)
        
        data = get_api_results(query, display=target_count, start=1)
        
        if not (data and data.get('items')):
            print(f"  > 수집할 상품이 없거나 오류 발생.")
            continue

        items = data['items']
        print(f"  > 상품 {len(items)}개 처리 시작...")
        for item in items:
            save_product_files(item, category_path)
        
        saved_in_category = len(items)
        total_saved_count += saved_in_category
        print(f"--- [{category}] 카테고리 작업 완료. {saved_in_category}개 파일 생성 시도. ---")
        time.sleep(0.5)

    print(f"\n--- 모든 작업 종료. 약 {total_saved_count}개 상품에 대한 파일 생성 시도 완료 ---")
    print(f"결과는 'back/crawled_data/cat' 폴더 아래 각 카테고리별로 저장되었습니다.")

if __name__ == "__main__":
    main()