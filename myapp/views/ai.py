from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from ..utils import recommend_meal_with_ai


class RecommendMealAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        items = request.data.get('items', [])
        if not items:
            return Response({'error': '품목 리스트가 필요합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        result = recommend_meal_with_ai(items)
        return Response({'recommendation': result}, status=status.HTTP_200_OK)