from django import forms
from .models import ExtractedText

class ImageUploadForm(forms.ModelForm):
    class Meta:
        model = ExtractedText
        fields = ['image']