import easyocr
import os
from django.conf import settings
import logging
from PIL import Image  # Pillow 라이브러리 임포트
import cv2  # OpenCV 임포트
import numpy as np  # NumPy 임포트

logger = logging.getLogger(__name__)

def perform_ocr(image_path, languages=['ko', 'en']):
    """
    주어진 이미지에서 OCR을 수행하고 결과를 반환합니다.

    Args:
        image_path (str): 이미지 파일 경로.
        languages (list): OCR에 사용할 언어 목록. 기본값은 ['ko', 'en'].

    Returns:
        list: 인식된 텍스트 정보 (bbox, text, prob) 목록. 오류 발생 시 None 반환.
    """
    try:
        # 이미지 파일 경로 생성
        image_path = os.path.join(settings.MEDIA_ROOT, image_path)
        print(f"이미지 파일 경로: {image_path}")  # 추가

        # 파일 경로 인코딩 (UTF-8)
        image_path_encoded = image_path.encode('utf-8').decode('utf-8')  # 추가

        # 이미지 파일 검증
        img = Image.open(image_path_encoded)  # 수정
        img.verify()
        print("이미지 파일 검증 성공")  # 추가

    except Exception as e:
        logger.error(f"이미지 파일 오류: {e}")
        return None

    try:
        reader = easyocr.Reader(languages)
        results = reader.readtext(image_path_encoded)  # 수정
        print(f"OCR 결과: {results}")  # 추가
        return results
    except Exception as e:
        logger.exception("OCR 처리 중 오류 발생")
        return None

if __name__ == '__main__':
    # 이 부분은 Django 환경에서는 실행되지 않습니다.
    # 테스트 목적으로 사용 가능합니다.
    image_path = 'king.png'  # 상대 경로로 변경
    results = perform_ocr(image_path)
    if results:
        for (bbox, text, prob) in results:
            print(f"인식된 텍스트: {text}, 확률: {prob:.2f}")
            print(f"영역 좌표: {bbox}")
            print("-" * 20)
    else:
        print("OCR 처리 실패")