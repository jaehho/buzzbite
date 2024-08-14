from django.db import models

class Video(models.Model):
    id = models.AutoField(primary_key=True)
    videoSource = models.URLField()
    caption = models.TextField(blank=True)
    likes = models.IntegerField(default=0)
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)
