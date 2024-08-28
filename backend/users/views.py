from django.contrib.auth.models import User
from rest_framework import viewsets
from .serializers import UserSerializer, ProfileSerializer
from .models import Profile


class UsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProfilesViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer