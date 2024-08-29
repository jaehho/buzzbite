from rest_framework import serializers
from django.contrib.auth.models import User

from content.serializers import VideoSerializer
from .models import Profile

  
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        # Hash the password and create a new user
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
        
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    video_ids = VideoSerializer(many=True, read_only=True, source='user.video_set')

    class Meta:
        model = Profile
        fields = ['user', 'profile_picture', 'followers', 'following', 'bio', 'video_ids']