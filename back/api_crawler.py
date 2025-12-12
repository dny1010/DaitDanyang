import requests
import pandas as pd
import os
import time

# --- 설정 ---
CLIENT_ID = "_TF3O7N2mhW6Kshn8AkL"
CLIENT_SECRET = "U7JdLSdXVs"
NAVER_API_URL = "https://openapi.naver.com/v1/search/shop.json"
BASE_SAVE_PATH = os.path.join(os.path.dirname(__file__), 'crawled_data')
os.makedirs(BASE_SAVE_PATH, exist_ok=True) # 저장 폴더 생성

# --- 수집할 작업 목록 ---
# 각 검색어 당 최대 1000개(100개 * 10페이지)까지 수집
TASKS = [
    {'category': '사료', 'query': '고양이 사료'},
    {'category': '캔', 'query': '고양이 캔'},
    {'category': '간식', 'query': '고양이 간식'},
    {'category': '모래', 'query': '고양이 모래'},
    {'category': '화장실', 'query': '고양이 화장실'},
    {'category': '미용/목욕', 'query': '고양이 미용'},
    {'category': '급식기/급수기', 'query': '고양이 급식기'},
    {'category': '하우스', 'query': '고양이 하우스'},
    {'category': '스크래쳐/캣타워', 'query': '고양이 스크래쳐'},
    {'category': '이동장', 'query': '고양이 이동장'},
    {'category': '건강관리', 'query': '고양이 영양제'},
    {'category': '의류', 'query': '고양이 옷'},
    {'category': '장난감', 'query': '고양이 장난감'},
]
# --- 작업 목록 끝 ---

def get_api_results(query, display, start):
    """네이버 쇼핑 API를 호출하고 결과를 반환"""
    headers = {"X-Naver-Client-Id": CLIENT_ID, "X-Naver-Client-Secret": CLIENT_SECRET}
    params = {"query": query, "display": display, "start": start, "sort": "sim"}
    try:
        response = requests.get(NAVER_API_URL, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"  [API 호출 오류: {e}]")
        return None

def main():
    print("--- 네이버 API 전용 크롤러 시작 ---")
    all_products = []
    
    for i, task in enumerate(TASKS):
        query = task['query']
        category = task['category']
        print(f"\n--- 작업 {i+1}/{len(TASKS)} 시작: [{category}] ---")
        
        # 페이지네이션: start 값을 1, 101, 201, ... 순으로 1000까지 요청
        for start_index in range(1, 1001, 100):
            data = get_api_results(query, display=100, start=start_index)
            
            if data and data['items']:
                print(f"  > 페이지 {int(start_index/100)+1}: 상품 {len(data['items'])}개 수집")
                # 각 상품에 카테고리 정보 추가
                for item in data['items']:
                    item['category'] = category
                all_products.extend(data['items'])
            else:
                print(f"  > 페이지 {int(start_index/100)+1}: 수집할 상품이 없거나 오류 발생. 다음 작업으로 넘어갑니다.")
                break # 더 이상 상품이 없으면 해당 카테고리 중단

            time.sleep(0.2) # API 호출 사이의 짧은 딜레이

    if not all_products:
        print("\n수집된 상품 데이터가 없습니다. 스크립트를 종료합니다.")
        return

    print(f"\n--- 총 {len(all_products)}개의 상품 데이터 수집 완료 ---")
    
    # Pandas DataFrame으로 변환
    df = pd.DataFrame(all_products)
    
    # HTML 태그 제거 및 데이터 정리
    df['title'] = df['title'].str.replace(r'<.*?>', '', regex=True)
    
    # 필요한 컬럼만 선택 (순서 지정)
    columns_to_save = [
        'category', 'title', 'lprice', 'brand', 'maker', 
        'link', 'image', 'productId', 'mallName'
    ]
    # 실제 존재하는 컬럼만 필터링
    existing_columns = [col for col in columns_to_save if col in df.columns]
    df_to_save = df[existing_columns]

    # CSV 파일로 저장
    save_path = os.path.join(BASE_SAVE_PATH, 'naver_shopping_data.csv')
    df_to_save.to_csv(save_path, index=False, encoding='utf-8-sig')
    
    print(f"\n데이터를 성공적으로 저장했습니다.")
    print(f"경로: {os.path.abspath(save_path)}")

if __name__ == "__main__":
    main()
