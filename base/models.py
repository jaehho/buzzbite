from django.db import models

class Video(models.Model):
    url = models.URLField()
    caption = models.CharField(max_length=100, null=True)
    created = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.url