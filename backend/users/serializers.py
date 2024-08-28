from rest_framework import serializers
from django.contrib.auth.models import User
from content.serializers import VideoSerializer

  
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']
        
class ProfileSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)

    # TODO: Use Profile Model
    class Meta:
        model = User
        fields = ['username', 'profile_picture', 'followers', 'following', 'videos']
