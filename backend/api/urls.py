from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login_view),
    path('create/', views.create_video),
    path('', views.get_videos),
    path('profile/', views.get_public_profile),
]