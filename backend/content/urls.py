from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'videos', views.VideoViewSet, basename='video')
router.register(r'watch-history', views.WatchHistoryViewSet, basename='watch-history')

urlpatterns = [
    path('', include(router.urls)),
]