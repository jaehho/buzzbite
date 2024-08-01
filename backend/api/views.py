from rest_framework.response import Response
from rest_framework.decorators import api_view
from video.models import Video
from .serializers import VideoSerializer
from rest_framework import status

@api_view(['GET'])
def getVideos(request):
    videos = Video.objects.all()
    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def createVideo(request):
    serializer = VideoSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        # Print or log the errors to debug
        print(serializer.errors)  # You can use logging instead of print in production
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)