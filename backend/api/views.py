from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import authenticate, login
from content.models import Video
from users.models import CustomUser
from .serializers import VideoSerializer, UserSerializer

# @api_view(['GET'])
# def getVideos(request):
#     videos = Video.objects.all()
#     serializer = VideoSerializer(videos, many=True)
#     return Response(serializer.data)

@api_view(['POST'])
def get_videos(request):
    username = request.data.get('username')
    
    if not username:
        return Response({'error': 'Username is required'}, status=400)
    
    # Filter the database objects based on the username
    videos = Video.objects.filter(user__username=username)[:5]  # Adjust the filter criteria
    
    # Serialize the objects to JSON format
    serializer = VideoSerializer(videos, many=True)
    
    return Response(serializer.data)

@api_view(['POST'])
def register(request):
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
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
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
