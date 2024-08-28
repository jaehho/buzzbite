# tests/test_views.py
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Video

class VideoTests(APITestCase):
    def setUp(self):
        # Creating a test user
        self.user, created = User.objects.get_or_create(username='testuser')
        self.user.set_password('password')
        self.user.save()
        self.client.force_authenticate(user=self.user)

    def test_create_video(self):
        url = reverse('video-list')  # Using the router name for listing/creating videos
        data = {
            'videoSource': 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/1.mp4',
            'caption': 'Test Video',
            'owner': self.user.id,  # Matching the model field
        }
        response = self.client.post(url, data, format='json')  # Correcting the method to post
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Video.objects.count(), 1)
        self.assertEqual(Video.objects.get().caption, 'Test Video')

    def test_list_videos(self):
        Video.objects.create(
            videoSource='https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/1.mp4',
            caption='Test Video',
            owner=self.user
        )
        url = reverse('video-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['caption'], 'Test Video')

    def test_retrieve_video(self):
        video = Video.objects.create(
            videoSource='https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/1.mp4',
            caption='Test Video',
            owner=self.user
        )
        url = reverse('video-detail', args=[video.id])  # Correcting the reverse lookup
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['caption'], 'Test Video')
