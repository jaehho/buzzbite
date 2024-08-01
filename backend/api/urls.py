from django.urls import path
from . import views

urlpatterns = [
    path('', views.getVideos),
    path('create/', views.createVideo),
]