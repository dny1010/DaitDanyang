
import os
import requests
import json
import datetime
import re

# 네이버 API 정보
CLIENT_ID = "1ccuqyxcw2LMG9S1Sr_N"
CLIENT_SECRET = "YbFLToH4jW"
SEARCH_URL = "https://openapi.naver.com/v1/search/shop.json"

def search_naver_shopping(query, display=40):
    """
    네이버 쇼핑 API를 호출하여 검색 결과를 반환합니다.
    """
    headers = {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
    }
    params = {"query": query, "display": display}
    
    try:
        response = requests.get(SEARCH_URL, headers=headers, params=params)
        response.raise_for_status()  # HTTP 오류가 발생하면 예외를 발생시킵니다.
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"API 요청 중 오류가 발생했습니다: {e}")
        return None

def process_and_save_items(items, main_category, output_dir):
    """
    검색된 아이템들을 처리하고 이미지와 메타데이터를 저장합니다.
    """
    if not items:
        print(f"{main_category}에 대한 검색 결과가 없습니다.")
        return

    # 저장할 디렉토리 생성
    images_dir = os.path.join(output_dir, "images")
    metadata_dir = os.path.join(output_dir, "metadata")
    os.makedirs(images_dir, exist_ok=True)
    os.makedirs(metadata_dir, exist_ok=True)

    for item in items:
        product_id = item['productId']
        
        # 제목에서 HTML 태그 제거
        title = re.sub('<.*?>', '', item['title'])

        # 요청된 형식에 맞춰 메타데이터 생성
        metadata = {
            "main_category": main_category.replace(" ", "_"),
            "sub_category": "사료",  # 사용자 요청에 따라 '사료'로 통일
            "title": title,
            "link": item['link'],
            "image": item['image'],
            "lprice": item['lprice'],
            "hprice": item['hprice'],
            "mallName": item['mallName'],
            "productId": product_id,
            "productType": item['productType'],
            "brand": item['brand'],
            "maker": item['maker'],
            "naver_category1": item.get('category1', ''),
            "naver_category2": item.get('category2', ''),
            "naver_category3": item.get('category3', ''),
            "naver_category4": item.get('category4', ''),
            "crawled_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        # 메타데이터를 JSON 파일로 저장 (UTF-8 인코딩)
        metadata_path = os.path.join(metadata_dir, f"{product_id}.json")
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=4)

        # 이미지 다운로드
        image_url = item['image']
        if image_url:
            try:
                image_response = requests.get(image_url)
                image_response.raise_for_status()
                
                # 이미지 파일 확장자 결정 (기본 .jpg)
                file_extension = os.path.splitext(image_url)[1]
                if not file_extension or len(file_extension) > 5:
                    file_extension = ".jpg"
                
                image_path = os.path.join(images_dir, f"{product_id}{file_extension}")
                with open(image_path, 'wb') as f:
                    f.write(image_response.content)
                print(f"  - {product_id} 저장 완료: {title}")
            except requests.exceptions.RequestException as e:
                print(f"  - 이미지 다운로드 실패 (ProductID: {product_id}): {e}")
    
    print(f"'{main_category}'에 대한 크롤링 및 저장이 완료되었습니다.")


def main():
    """
    메인 실행 함수
    """
    base_dir = "crawled_data"
    
    queries = {
        "고양이 사료": os.path.join(base_dir, "cat_food"),
        "강아지 사료": os.path.join(base_dir, "dog_food")
    }

    for query, output_dir in queries.items():
        print(f"\n'{query}' 크롤링을 시작합니다...")
        
        data = search_naver_shopping(query, display=40) # 최대 40개까지 조회
        
        if data and 'items' in data:
            process_and_save_items(data['items'], query, output_dir)
        else:
            print(f"'{query}'에 대한 데이터를 가져오지 못했습니다.")

if __name__ == "__main__":
    main()
