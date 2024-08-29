from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, WatchHistoryViewSet, RecommendedVideoList, LikeViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'watch-history', WatchHistoryViewSet, basename='watch-history')
router.register(r'likes', LikeViewSet, basename='likes')
router.register(r'comments', CommentViewSet, basename='comments')

urlpatterns = [
    path('', include(router.urls)),
    path('recommended/', RecommendedVideoList.as_view(), name='recommended-videos'),
]
