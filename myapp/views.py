import cv2
import easyocr
from django.shortcuts import render
import numpy as np
import base64
from django.views.decorators.csrf import csrf_exempt


def preprocess_image(image):
    # 이미지 전처리 함수 (이전 답변 참조)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    median = cv2.medianBlur(thresh, 3)
    return median


@csrf_exempt
def ocr_view(request):
    if request.method == 'POST':
        try:
            # 캡쳐된 이미지가 base64 인코딩된 문자열 형태로 전송된다고 가정
            image_data = request.POST.get('image')

            # base64 문자열을 이미지로 디코딩
            image_data_encoded = image_data  # 이미지 데이터 저장

            image_data = image_data.split(',')[1]  # "data:image/png;base64," 제거
            decoded_data = base64.b64decode(image_data)

            # 디코딩된 데이터를 numpy array로 변환
            np_data = np.frombuffer(decoded_data, np.uint8)

            # numpy array를 OpenCV 이미지로 변환
            image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

            # 이미지 전처리
            preprocessed_image = preprocess_image(image)

            # EasyOCR을 사용하여 텍스트 추출
            reader = easyocr.Reader(['ko', 'en'])  # 한국어, 영어 지원
            results = reader.readtext(preprocessed_image)

            # 결과 처리 (추출된 텍스트를 웹 페이지에 표시)
            extracted_text = ""
            for (bbox, text, prob) in results:
                extracted_text += text + " "

            return render(request, 'ocr_result.html',
                          {'extracted_text': extracted_text, 'captured_image': image_data_encoded})

        except Exception as e:
            print(f"오류 발생: {e}")  # 오류 로깅
            return render(request, 'ocr_result.html', {'extracted_text': 'OCR 처리 실패', 'captured_image': None})

    return render(request, 'upload_form.html')


def home(request):
    return render(request, 'home.html')