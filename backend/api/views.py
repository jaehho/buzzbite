from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from content.models import Video
from users.models import CustomUser
from .serializers import VideoSerializer, UserSerializer, ProfileSerializer


@api_view(['POST'])
def register_user(request):
    required_fields = ['username', 'email', 'password']
    missing_fields = [field for field in required_fields if field not in request.data]

    if missing_fields:
        return Response(
            {"error": f"Missing fields: {', '.join(missing_fields)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = CustomUser.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
            bio=serializer.validated_data.get('bio', '')
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''
{
"username":"testuser",
"email":"testuser@gmail.com",
"password":"password"
}
'''

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({"detail": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
    
    return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

'''
{
"username":"testuser",
"password":"password"
}
''' 

@api_view(['POST'])
def create_video(request):
    serializer = VideoSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''
{
"videoSource": "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/2.mp4",
"caption": "Caption Here",
"likes": "10"
}
'''

@api_view(['GET'])
def get_videos(request):
    username = request.query_params.get('username', 'testuser')
    
    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    videos = Video.objects.all()  # Ideally, filter by username if the model supports it
    
    serializer = VideoSerializer(videos, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

'''
GET /api/get-videos/?username=testuser
'''

@api_view(['GET'])
def get_public_profile(request):
    username = request.query_params.get('username')
    
    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = get_object_or_404(CustomUser, username=username)

    serializer = ProfileSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

'''
GET /api/get-public-profile/?username=testuser
'''
