from django.db import models
from django.conf import settings

class Content(models.Model):
    url = models.URLField()
    caption = models.TextField(blank=True)
    thumbnail = models.URLField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='videos')
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url

    def likes_count(self):
        return self.likes.count()

    def comments_count(self):
        return self.comments.count()

    def views_count(self):
        return self.views.count()

class Comment(models.Model):
    video = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.user} on {self.video}'

class Like(models.Model):
    video = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('video', 'user')

    def __str__(self):
        return f'Like by {self.user} on {self.video}'

class View(models.Model):
    video = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('video', 'user')

    def __str__(self):
        return f'View by {self.user} on {self.video}'
