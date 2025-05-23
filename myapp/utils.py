import requests
import uuid
import time
import json
import cv2
from django.conf import settings
import re
import os

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    return thresh

def perform_naver_ocr(image_path):
    """네이버 CLOVA OCR API를 사용한 OCR 함수"""
    api_url = settings.NAVER_OCR_API_URL
    secret_key = settings.NAVER_OCR_SECRET_KEY

    request_json = {
        'images': [
            {
                'format': 'jpg',
                'name': 'demo'
            }
        ],
        'requestId': str(uuid.uuid4()),
        'version': 'V2',
        'timestamp': int(round(time.time() * 1000))
    }

    payload = {'message': json.dumps(request_json).encode('UTF-8')}
    files = [
        ('file', open(image_path, 'rb'))
    ]
    headers = {
        'X-OCR-SECRET': secret_key
    }

    response = requests.post(api_url, headers=headers, data=payload, files=files)
    result = response.json()

    # 텍스트 추출
    texts = []
    if 'images' in result and 'fields' in result['images'][0]:
        for field in result['images'][0]['fields']:
            texts.append(field['inferText'])
    return texts

def is_probable_item(line):
    # 너무 짧은 줄 제외
    if len(line.strip()) < 2:
        return False
    # '합계', '카드', '현금' 등 비품목 키워드만 제외
    exclude_keywords = [
        "합계", "총액", "카드", "현금", "일시", "사업자", "대표자", "전화", "승인", "No", "잔액",
        "금액", "부가세", "면세", "점포", "영수증", "매장", "고객", "포인트", "결제", "발급"
    ]
    for keyword in exclude_keywords:
        if keyword in line:
            return False
    # 한글/영문+숫자(가격)가 모두 있는 줄
    if re.search(r"[가-힣A-Za-z]+.*\d+", line):
        return True
    return False

TOGETHER_API_KEY = os.environ.get("TOGETHER_API_KEY")
TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions"

def build_meal_prompt(items):
    return (
        "다음은 사용자가 가지고 있는 식재료 목록입니다.\n\n"
        f"{', '.join(items)}\n\n"
        "이 재료들만 사용해서 만들 수 있는 한식 메뉴를 2~3가지 추천해 주세요. "
        "각 메뉴별로 간단한 요리 방법도 한글로 2~3줄 이내로 설명해 주세요. "
        "출처 번호나 [1], [2] 등은 포함하지 말고, 오직 한국어로만 작성해 주세요."
    )

def recommend_meal_with_ai(items):
    prompt = build_meal_prompt(items)
    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",  # 원하는 together.ai 모델명
        "messages": [
            {"role": "system", "content": "당신은 요리 전문가입니다."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 512,
        "temperature": 0.7
    }
    response = requests.post(TOGETHER_API_URL, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        return "추천 결과를 가져오지 못했습니다."