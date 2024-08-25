from rest_framework import serializers
from content.models import Video
from users.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class VideoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_picture = serializers.URLField(source='user.profile_picture', read_only=True)
    
    class Meta:
        model = Video
        fields = ['id', 'username', 'profile_picture', 'videoSource', 'caption', 'likes', 'upload_date']

class ProfileSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'profile_picture', 'followers', 'following', 'videos']