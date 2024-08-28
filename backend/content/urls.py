from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, WatchHistoryViewSet, RecommendedVideoList

router = DefaultRouter()
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'watch-history', WatchHistoryViewSet, basename='watch-history')

urlpatterns = [
    path('', include(router.urls)),
    path('recommended/', RecommendedVideoList.as_view(), name='recommended-videos'),
]
