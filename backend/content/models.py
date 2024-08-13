from django.db import models
from django.conf import settings

class Video(models.Model):
    id = models.AutoField(primary_key=True)
    videoSource = models.URLField()
    caption = models.TextField(blank=True)
    likes = models.IntegerField(default=0)
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.id

'''
{
"videoSource": "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/2.mp4",
"caption": "Caption Here",
"id":"1",
"likes": "10"
}
'''