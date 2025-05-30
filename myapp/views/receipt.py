from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from myapp.models import Receipt
from myapp.serializers import ReceiptUploadSerializer
from myapp.utils import extract_items_from_receipt_with_gemini
import json

class ReceiptUploadAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ReceiptUploadSerializer(data=request.data)
        if serializer.is_valid():
            receipt = serializer.save(user=request.user)
            return Response({'id': receipt.id, 'image': receipt.image.url}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

        try:
            extracted_text = extract_items_from_receipt_with_gemini(receipt.image.path)
            return Response({
                'extracted_text': extracted_text,
                'captured_image': receipt.image.url
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Gemini 품목 추출 중 에러: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)