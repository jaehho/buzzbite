from django.db import models
from users.models import CustomUser

class Video(models.Model):
    owner = models.ForeignKey(CustomUser, related_name='videos', on_delete=models.CASCADE)
    videoSource = models.URLField()
    caption = models.TextField(blank=True)
    likes = models.IntegerField(default=0)
    upload_date = models.DateTimeField(auto_now_add=True)
