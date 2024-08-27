from rest_framework import permissions, viewsets
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Video, WatchHistory
from .permissions import IsOwnerOrReadOnly
from .serializers import VideoSerializer, WatchHistorySerializer


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
        Return watch history records for the authenticated user or for a specific video.
        """
        video_id = self.request.query_params.get('video_id')
        user = self.request.user

        if video_id:
            video = get_object_or_404(Video, id=video_id)
            if video.owner != user:
                raise PermissionDenied("You do not have permission to view the watch history for this video.")
            # Return watch history records for the specified video if the user is the owner
            return WatchHistory.objects.filter(video=video)
        else:
            # Default: Return all watch history records for the authenticated user
            return WatchHistory.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        """
        Create or update a watch history record.
        """
        video_id = request.data.get('video')
        video = get_object_or_404(Video, id=video_id)

        watch_history, created = WatchHistory.objects.update_or_create(
            user=request.user,
            video=video,
            defaults={'viewed_at': timezone.now()}
        )

        if created:
            return Response({"detail": "Video view has been recorded."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"detail": "Video view timestamp updated."}, status=status.HTTP_200_OK)
