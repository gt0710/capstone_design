from django.urls import path
from . import views
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', views.home, name='home'),
    path('upload/', views.upload_receipt, name='upload_receipt'),
    path('save_items/', views.save_selected_items, name='save_selected_items'),
    path('items/', views.item_list, name='item_list'),
    path('signup/', views.signup, name='signup'),
]