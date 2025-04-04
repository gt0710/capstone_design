import cv2
import easyocr

def preprocess_image(image_path):
    """이미지 전처리 함수."""
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # 흑백 변환
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1] # 이진화
    return thresh

def perform_ocr(image_path, language='ko'):
    """OCR 수행 함수."""
    preprocessed_image = preprocess_image(image_path)
    reader = easyocr.Reader([language]) # 언어 설정
    results = reader.readtext(preprocessed_image)
    return results