from rest_framework import serializers
from content.models import Video
from users.models import CustomUser

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'profile_picture', 'followers', 'following', 'videos']