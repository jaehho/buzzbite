from rest_framework import serializers
from .models import CustomUser
from content.serializers import VideoSerializer

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = '__all__'
        
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['url', 'username', 'email', 'is_staff']
        
class ProfileSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'profile_picture', 'followers', 'following', 'videos']