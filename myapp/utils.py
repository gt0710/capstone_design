import requests
import uuid
import time
import json
import cv2
from django.conf import settings
import re

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