from rest_framework import serializers
from video.models import Content

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = '__all__'