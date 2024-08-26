from rest_framework import permissions, viewsets

from .models import Video
from .permissions import IsOwnerOrReadOnly
from .serializers import VideoSerializer


class VideoViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = (
        permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly, )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)