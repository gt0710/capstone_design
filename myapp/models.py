from django.db import models

class ExtractedText(models.Model):
    image = models.ImageField(upload_to='images/')  # 이미지 저장 필드
    text = models.TextField()  # 추출된 텍스트 저장 필드
    uploaded_at = models.DateTimeField(auto_now_add=True)  # 업로드 시간

    def __str__(self):
        return f"Text from {self.image.name}"