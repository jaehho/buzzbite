from rest_framework import serializers
from .models import Video, WatchHistory


class VideoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='owner.username', read_only=True)
    profile_picture = serializers.URLField(source='owner.profile.profile_picture', read_only=True)
    
    class Meta:
        model = Video
        fields = ['id', 'username', 'profile_picture', 'videoSource', 'caption', 'likes', 'upload_date']
        
class WatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchHistory
        fields = ['user', 'video', 'viewed_at']
        read_only_fields = ['user', 'viewed_at']