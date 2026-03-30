from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Card
from django.contrib.auth import get_user_model

User = get_user_model()

class CardManagementTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='StrongPassword123')
        # Login and set auth header
        login_data = {'email': 'testuser@example.com', 'password': 'StrongPassword123'}
        response = self.client.post(reverse('token_obtain_pair'), login_data, format='json')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.data['access'])

        self.cards_url = reverse('card-list')
        self.card_data = {
            'cardholder_name': 'John Doe',
            'card_type': 'CREDIT',
            'card_number': '1234567812345678',
            'expiry_month': '12',
            'expiry_year': '2025',
            'cvv': '123'
        }

    def test_add_card(self):
        response = self.client.post(self.cards_url, self.card_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Card.objects.count(), 1)
        self.assertEqual(Card.objects.get().last_4_digits, '5678')
        # Check no CVV stored on returned representation
        self.assertNotIn('cvv', response.data)

    def test_list_cards(self):
        self.client.post(self.cards_url, self.card_data, format='json')
        response = self.client.get(self.cards_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_delete_card(self):
        self.client.post(self.cards_url, self.card_data, format='json')
        card = Card.objects.first()
        delete_url = reverse('card-detail', args=[card.id])
        
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Card.objects.count(), 0)
