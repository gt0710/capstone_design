import requests
import uuid
import time
import json
import cv2
from django.conf import settings  # 추가

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    return thresh

def perform_naver_ocr(image_path):
    """네이버 CLOVA OCR API를 사용한 OCR 함수"""
    api_url = settings.NAVER_OCR_API_URL         # settings에서 불러오기
    secret_key = settings.NAVER_OCR_SECRET_KEY   # settings에서 불러오기

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