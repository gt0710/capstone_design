from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from .models import Receipt, Item
from .utils import perform_naver_ocr, is_probable_item

@login_required
def upload_receipt(request):
    if request.method == 'POST':
        image = request.FILES.get('image')
        if not image:
            return render(request, 'upload_receipt.html', {'error': '이미지를 업로드해주세요.'})

        receipt = Receipt.objects.create(user=request.user, image=image)
        file_path = receipt.image.path

        texts = perform_naver_ocr(file_path)
        items = [line for line in texts if is_probable_item(line)]
        return render(request, 'select_items.html', {'items': items, 'receipt_id': receipt.id})

    return render(request, 'upload_receipt.html')

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

def home(request):
    return render(request, 'home.html')

def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})