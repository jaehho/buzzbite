from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    profile_picture = models.URLField(max_length=2048, blank=True, default='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png')
    followers = models.PositiveIntegerField(default=0)
    following = models.PositiveIntegerField(default=0)
    bio = models.TextField(max_length=500, blank=True)

    def __str__(self):
        return self.username
