from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from myapp.models import Receipt, Item
from myapp.serializers import ItemSerializer

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

        if isinstance(selected_items, str):
            import json
            selected_items = json.loads(selected_items)

        for name in selected_items:
            Item.objects.create(receipt=receipt, name=name)

        return Response({'message': '저장 성공!'}, status=status.HTTP_201_CREATED)

class ItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(receipt__user=self.request.user).order_by('-created_at')