from rest_framework import serializers
from django.contrib.auth.models import User

from content.serializers import VideoSerializer
from .models import Profile

  
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']
        
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    video_ids = VideoSerializer(many=True, read_only=True, source='user.videos')

    class Meta:
        model = Profile
        fields = ['user', 'profile_picture', 'followers', 'following', 'bio', 'video_ids']