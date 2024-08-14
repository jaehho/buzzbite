from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_videos),
    path('create/', views.create_video),
    path('register/', views.register),
    path('login/', views.login_view),

]