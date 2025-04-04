from django.urls import path
from . import views

urlpatterns = [
    path('ocr/', views.ocr_view, name='ocr_view'),  # OCR 뷰
    path('', views.home, name='home'),  # 루트 URL을 home 뷰에 연결
]