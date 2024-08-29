from rest_framework import serializers
from .models import Video, WatchHistory, Likes, Comments

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_picture = serializers.URLField(source='user.profile.profile_picture', read_only=True)
    
    class Meta:
        model = Comments
        fields = ['id', 'username', 'profile_picture', 'comment', 'commented_at']

class VideoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='owner.username', read_only=True)
    user_id = serializers.IntegerField(source='owner.id', read_only=True)
    profile_picture = serializers.URLField(source='owner.profile.profile_picture', read_only=True)
    likes = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True, source='comments_set')

    class Meta:
        model = Video
        fields = ['id', 'username', 'user_id', 'profile_picture', 'videoSource', 'caption', 'likes', 'comments']

    def get_likes(self, obj):
        return Likes.objects.filter(video=obj).count()

class WatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchHistory
        fields = ['user', 'video', 'viewed_at']
        read_only_fields = ['user', 'viewed_at']
