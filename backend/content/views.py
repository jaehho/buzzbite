from rest_framework import permissions, viewsets, generics
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response

from .models import Video, WatchHistory
from users.models import CustomUser
from .permissions import IsOwnerOrReadOnly
from .serializers import VideoSerializer, WatchHistorySerializer
from users.serializers import UserSerializer


class VideoViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    serializer_class = VideoSerializer
    permission_classes = (
        permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly, )

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            # Get videos that the user has not viewed
            viewed_videos = WatchHistory.objects.filter(user=user).values_list('video', flat=True)
            return Video.objects.exclude(id__in=viewed_videos)
        else:
            return Video.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class WatchHistoryViewSet(viewsets.ModelViewSet):
    """
    Viewset to handle creating and listing watch history records.
    """
    serializer_class = WatchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Optionally restricts the returned watch history based on video_id.
        """
        video_id = self.request.query_params.get('video_id')
        user = self.request.user

        if video_id:
            # Return watch history records for the specified video
            return WatchHistory.objects.filter(video_id=video_id)
        else:
            # Default: Return all watch history records for the authenticated user
            return WatchHistory.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        """
        Create or update a watch history record.
        """
        video_id = request.data.get('video')
        video = get_object_or_404(Video, id=video_id)

        # Create or update the watch history record
        watch_history, created = WatchHistory.objects.update_or_create(
            user=request.user,
            video=video,
            defaults={'viewed_at': timezone.now()}
        )

        if created:
            return Response({"detail": "Video view has been recorded."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"detail": "Video view timestamp updated."}, status=status.HTTP_200_OK)


class VideoWatchedUsersView(generics.ListAPIView):
    """
    API endpoint to list all users who have watched a specific video.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        video_id = self.kwargs['video_id']
        user_ids = WatchHistory.objects.filter(video_id=video_id).values_list('user', flat=True)
        return CustomUser.objects.filter(id__in=user_ids)
