# tests/test_views.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Video
from users.models import CustomUser

class PostTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.get_or_create(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)

    def test_create_post(self):
        url = reverse('post-list')  # Assuming 'post-list' is the name given by the router
        data = {'title': 'Test Video', 'content': 'Test content.', 'author': self.user.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Video.objects.count(), 1)
        self.assertEqual(Video.objects.get().title, 'Test Video')

    def test_list_posts(self):
        Video.objects.create(title='Test Video', content='Test content.', author=self.user)
        url = reverse('post-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_post(self):
        post = Video.objects.create(title='Test Video', content='Test content.', author=self.user)
        url = reverse('post-detail', args=[post.id])  # Assuming 'post-detail' is the name given by the router
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Video')
