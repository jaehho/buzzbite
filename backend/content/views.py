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
        IsOwnerOrReadOnly,
    )

    def get_queryset(self):
        user = self.request.user
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            # When retrieving a single video, return all videos
            return Video.objects.all()
        elif user.is_authenticated:
            # Get videos that the user has not viewed
            viewed_videos = WatchHistory.objects.filter(user=user).values_list('video', flat=True)
            return Video.objects.exclude(id__in=viewed_videos)
        else:
            # Return all videos but add a flag to indicate anonymous viewing
            self.request._anonymous_viewing = True
            return Video.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Check if the request is anonymous
        if hasattr(request, '_anonymous_viewing') and request._anonymous_viewing:
            return Response(
                {
                    "detail": "You are viewing videos anonymously.",
                    "videos": serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        # Retrieve a single video instance regardless of the view status
        video = self.get_object()
        serializer = self.get_serializer(video)
        return Response(serializer.data)

    def perform_create(self, serializer):
        # Set the owner of the video to the authenticated user
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
