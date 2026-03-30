from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Transaction
from django.contrib.auth import get_user_model

User = get_user_model()

class TransactionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='StrongPassword123')
        self.admin = User.objects.create_superuser(username='admin', email='admin@example.com', password='adminpassword')
        
        # User auth
        login_res = self.client.post(reverse('token_obtain_pair'), {'email': 'testuser@example.com', 'password': 'StrongPassword123'}, format='json')
        self.user_token = login_res.data['access']
        
        # Admin auth
        login_res_admin = self.client.post(reverse('token_obtain_pair'), {'email': 'admin@example.com', 'password': 'adminpassword'}, format='json')
        self.admin_token = login_res_admin.data['access']

    def test_list_transactions_user(self):
        Transaction.objects.create(user=self.user, amount=100, status='SUCCESS', transaction_id='txn_1')
        Transaction.objects.create(user=self.admin, amount=200, status='SUCCESS', transaction_id='txn_2')
        
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user_token)
        response = self.client.get(reverse('transaction-list'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) # User should only see their own

    def test_list_transactions_admin(self):
        Transaction.objects.create(user=self.user, amount=100, status='SUCCESS', transaction_id='txn_1')
        Transaction.objects.create(user=self.admin, amount=200, status='SUCCESS', transaction_id='txn_2')
        
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_token)
        response = self.client.get(reverse('transaction-list'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2) # Admin sees all

    def test_export_csv_permissions(self):
        # Test non-admin fails
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user_token)
        response = self.client.get(reverse('export-transactions'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Test admin succeeds
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_token)
        response = self.client.get(reverse('export-transactions'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/csv')
