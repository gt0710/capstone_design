import os
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image

# 1. 환경 변수에서 API 키 로드 및 Gemini 초기화 (최상단에서 한 번만)
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

def extract_items_from_receipt_with_gemini(image_path):
    """
    영수증 이미지에서 품목명과 수량을 추출하는 함수 (Gemini 1.5 Pro 사용)
    """
    img = Image.open(image_path)
    prompt = (
        "아래 이미지는 영수증입니다.\n"
        "이 영수증에서 구매한 품목명과 수량만 한글로 추출해 주세요.\n"
        "각 품목은 '품목명 수량' 형식으로, 줄바꿈(엔터)으로 구분해서 여러 줄로 출력해 주세요.\n"
        "예시:\n사과 2개\n바나나 1개\n포도 3개\n"
        "출처 번호, 광고 문구 등은 제외하고 오직 품목명과 수량만 뽑아주세요."
    )
    model = genai.GenerativeModel("gemini-1.5-pro")
    try:
        response = model.generate_content([prompt, img])
        return response.text if hasattr(response, "text") else ""
    except Exception as e:
        return f"에러 발생: {e}"

def build_meal_prompt(items):
    """
    사용자가 가진 식재료 목록으로 만들 수 있는 요리법 추천 프롬프트 생성
    """
    return (
        "다음은 사용자가 가지고 있는 식재료 목록입니다.\n\n"
        f"{', '.join(items)}\n\n"
        "이 재료들을 사용해서 만들 수 있는 오늘 한 끼 식단을 추천해줘.\n"
        "조미료는 다 있다고 가정하자.\n"
        "각 메뉴별로 간단한 요리 방법도 한글로 2~3줄 이내로 설명해 주세요.\n"
        "출처 번호나 [1], [2] 등은 포함하지 말고, 오직 한국어로만 작성해 주세요.\n"
        "같은 문장 반복 없이 각 메뉴에 맞게 작성해 주세요.\n"
        "각 메뉴는 실제 줄바꿈(Enter)으로 구분해서 여러 줄로 출력해 주세요.\n"
        "'\\n'이라는 문자를 출력하지 말고, 실제로 줄을 바꿔서 작성해 주세요.\n"
        "아래와 같은 형식으로 작성해 주세요:\n"
        "[식단 이름]\n"
        "- 재료: (사용한 재료 나열)\n"
        "- 조리 방법: (간단한 요리 방법 2~3줄)\n"
    )

def recommend_meal_with_ai(items):
    """
    식재료 목록으로 요리법을 추천하는 함수 (Gemini 1.5 Pro 사용)
    """
    prompt = build_meal_prompt(items)
    model = genai.GenerativeModel("gemini-1.5-pro")
    try:
        response = model.generate_content(prompt)
        return response.text if hasattr(response, "text") else "추천 결과를 가져오지 못했습니다."
    except Exception as e:
        return f"에러 발생: {e}"