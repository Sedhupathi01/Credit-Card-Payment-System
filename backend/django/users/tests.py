from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'StrongPassword123'
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('username' in response.data)
        self.assertEqual(User.objects.count(), 1)

    def test_user_login(self):
        # Create user
        User.objects.create_user(username=self.user_data['username'], email=self.user_data['email'], password=self.user_data['password'])
        
        login_data = {'email': self.user_data['email'], 'password': self.user_data['password']}
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
