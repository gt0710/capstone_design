from django.urls import path
from . import views
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', views.home, name='home'),
    path('api/save_items/', views.SaveSelectedItemsAPIView.as_view(), name='api_save_items'),
    path('items/', views.item_list, name='item_list'),
    path('api_signup/', views.UserSignupView.as_view(), name='api_signup'),
    path('api/login/', views.LoginView.as_view(), name='api_login'),
    path('api/receipt-upload/', views.ReceiptUploadAPIView.as_view(), name='api_receipt_upload'),
    path('api/items/', views.ItemListAPIView.as_view(), name='api_items'),
    path('api/ocr-result/', views.OCRResultAPIView.as_view(), name='api_ocr_result'),
]