import base64
import uuid
import os
from django.core.files import File
from django.contrib.auth.decorators import login_required
from .models import Receipt, Item
from .utils import perform_naver_ocr
from django.shortcuts import render

@login_required
def upload_receipt(request):
    if request.method == 'POST':
        image_data = request.POST.get('image_data')
        if not image_data:
            return render(request, 'upload_receipt.html', {'error': '이미지를 촬영해주세요.'})

        # base64 데이터에서 실제 이미지 데이터 추출
        format, imgstr = image_data.split(';base64,')
        ext = format.split('/')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join('media', 'receipts', filename)

        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, 'wb') as f:
            f.write(base64.b64decode(imgstr))

        # Receipt 모델에 저장
        with open(file_path, 'rb') as f:
            receipt = Receipt.objects.create(user=request.user)
            receipt.image.save(filename, File(f), save=True)

        # OCR 수행 (file_path 사용)
        texts = perform_naver_ocr(file_path)

        # 품목 후보 리스트
        items = texts

        return render(request, 'select_items.html', {'items': items, 'receipt_id': receipt.id})

    return render(request, 'upload_receipt.html')

from django.shortcuts import redirect

@login_required
def save_selected_items(request):
    if request.method == 'POST':
        receipt_id = request.POST.get('receipt_id')
        selected_items = request.POST.getlist('selected_items')
        if not receipt_id or not selected_items:
            return redirect('upload_receipt')

        receipt = Receipt.objects.get(id=receipt_id, user=request.user)

        for name in selected_items:
            Item.objects.create(receipt=receipt, name=name)

        return redirect('item_list')

@login_required
def item_list(request):
    items = Item.objects.filter(receipt__user=request.user).order_by('-created_at')
    return render(request, 'item_list.html', {'items': items})

from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect

def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # 로그인 페이지로 이동
    else:
        form = UserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})

def home(request):
    return render(request, 'home.html')