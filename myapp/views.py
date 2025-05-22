from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Receipt, Item
from .utils import perform_naver_ocr, is_probable_item
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
# DRF import
from rest_framework import generics, permissions
from .serializers import UserSignupSerializer
from .serializers import ReceiptUploadSerializer
from .serializers import ItemSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class SaveSelectedItemsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        receipt_id = request.data.get('receipt_id')
        selected_items = request.data.get('selected_items', [])
        if not receipt_id or not selected_items:
            return Response({'error': 'receipt_id와 selected_items를 모두 입력하세요.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receipt = Receipt.objects.get(id=receipt_id, user=request.user)
        except Receipt.DoesNotExist:
            return Response({'error': '영수증을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)

        # selected_items가 리스트가 아닐 수도 있으니 보정
        if isinstance(selected_items, str):
            import json
            selected_items = json.loads(selected_items)

        for name in selected_items:
            Item.objects.create(receipt=receipt, name=name)

        return Response({'message': '저장 성공!'}, status=status.HTTP_201_CREATED)

@login_required
def item_list(request):
    items = Item.objects.filter(receipt__user=request.user).order_by('-created_at')
    return render(request, 'item_list.html', {'items': items})

def home(request):
    return render(request, 'home.html')

# DRF 회원가입 API 뷰
class UserSignupView(generics.CreateAPIView):
    serializer_class = UserSignupSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        else:
            return Response({"error": "Wrong Credentials"}, status=400)

class ReceiptUploadAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = ReceiptUploadSerializer(data=request.data)
        if serializer.is_valid():
            receipt = serializer.save(user=request.user)
            return Response({'id': receipt.id, 'image': receipt.image.url}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(receipt__user=self.request.user).order_by('-created_at')

class OCRResultAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        receipt_id = request.GET.get('receipt_id')
        if not receipt_id:
            return Response({'error': 'receipt_id가 필요합니다.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            receipt = Receipt.objects.get(id=receipt_id, user=request.user)
        except Receipt.DoesNotExist:
            return Response({'error': '영수증을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)

        # 실제 OCR 수행
        ocr_text = perform_naver_ocr(receipt.image.path)
        captured_image = receipt.image.url

        return Response({
            'extracted_text': ocr_text,
            'captured_image': captured_image
        })