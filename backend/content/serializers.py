from rest_framework import serializers
from .models import Video, WatchHistory, Like, Comment


class LikeSerializer(serializers.ModelSerializer):
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)
    
    class Meta:
        model = Like
        fields = ['id', 'owner_id', 'video', 'liked_at']


class CommentSerializer(serializers.ModelSerializer):
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)
    profile_picture = serializers.URLField(source='owner.profile.profile_picture', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'owner_id', 'profile_picture', 'video', 'comment_text', 'commented_at', 'likes']


class VideoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='owner.username', read_only=True)
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)
    profile_picture = serializers.URLField(source='owner.profile.profile_picture', read_only=True)
    likes = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True, source='comments_set')

    class Meta:
        model = Video
        fields = ['id', 'username', 'owner_id', 'profile_picture', 'videoSource', 'caption', 'likes', 'comments']

    def get_likes(self, obj):
        return Like.objects.filter(video=obj).count()


class WatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchHistory
        fields = ['user', 'video', 'viewed_at']
        read_only_fields = ['user', 'viewed_at']
