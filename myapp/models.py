from django.db import models
from django.contrib.auth.models import User

class Receipt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='receipts/')
    receipt_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}의 영수증 ({self.created_at.date()})"

class Item(models.Model):
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=1)
    expiration_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (x{self.quantity})"