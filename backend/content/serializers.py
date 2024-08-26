from rest_framework import serializers
from .models import Video

class VideoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_picture = serializers.URLField(source='user.profile_picture', read_only=True)
    
    class Meta:
        model = Video
        fields = ['id', 'username', 'profile_picture', 'videoSource', 'caption', 'likes', 'upload_date']