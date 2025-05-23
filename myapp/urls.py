from django.urls import path
from myapp.views.auth import UserSignupView, LoginView
from myapp.views.receipt import ReceiptUploadAPIView, OCRResultAPIView
from myapp.views.item import SaveSelectedItemsAPIView, ItemListAPIView
from myapp.views.ai import RecommendMealAPIView

urlpatterns = [
    path('api/signup/', UserSignupView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/receipt-upload/', ReceiptUploadAPIView.as_view(), name='receipt_upload'),
    path('api/ocr-result/', OCRResultAPIView.as_view(), name='ocr_result'),
    path('api/save_items/', SaveSelectedItemsAPIView.as_view(), name='save_items'),
    path('api/items/', ItemListAPIView.as_view(), name='item_list'),
    path('api/recommend_meal/', RecommendMealAPIView.as_view(), name='recommend_meal'),
]