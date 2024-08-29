from rest_framework import permissions, viewsets, generics
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Video, WatchHistory, Like, Comment
from .permissions import IsOwnerOrReadOnly
from .serializers import VideoSerializer, WatchHistorySerializer, LikeSerializer, CommentSerializer


class VideoViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = (
        # permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly,
    )

    def perform_create(self, serializer):
        # Set the owner of the video to the authenticated user
        serializer.save(owner=self.request.user)
        

class RecommendedVideoList(generics.ListAPIView):
    """
    API view that returns recommnended videos for authenticated users.
    """
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Get videos that the user has not viewed
        viewed_videos = WatchHistory.objects.filter(user=user).values_list('video', flat=True)
        return Video.objects.exclude(id__in=viewed_videos)


class WatchHistoryViewSet(viewsets.ModelViewSet): # TODO: Refactor with ListCreateAPIView
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
        video_id = request.data.get('video_id')
        video = get_object_or_404(Video, id=video_id)

        watch_history, created = WatchHistory.objects.update_or_create(
            user=request.user,
            video=video,
            defaults={'viewed_at': timezone.now()}
        )

        if created:
            return Response({"detail": "Video view has been recorded."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"detail": "Video view timestamp updated."}, status=status.HTTP_200_OK) # TODO: use patch instead of create


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Create or acknowledge a like if it doesn't exist.
        """
        user = request.user
        video_id = request.data.get('video_id')
        video = get_object_or_404(Video, id=video_id)

        # Check if the like already exists, if not create it
        like, created = Like.objects.get_or_create(user=user, video=video)

        if created:
            return Response({"detail": "Video has been liked."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"detail": "You have already liked this video."}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        video_id = kwargs['pk']
        try:
            like = Like.objects.get(user=user, video_id=video_id)
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Like.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        video_id = request.data.get('video_id')
        video = get_object_or_404(Video, id=video_id)
        comment = Comment(user=request.user, video=video, comment=request.data.get('comment'))
        comment.save()
        return Response(status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        comment_id = kwargs['pk']
        comment = Comment.objects.filter(id=comment_id, user=request.user).first()
        if comment:
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)
