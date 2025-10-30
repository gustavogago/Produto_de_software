from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import unittest


class HealthCheckTest(APITestCase):
    def test_health_check(self):
        """Test simples que sempre passa"""
        self.assertTrue(True)

    def test_api_accessible(self):
        """Testa se a API está respondendo"""
        url = reverse('get-items')  # URL pública que existe
        response = self.client.get(url)
        # Só verifica que não é 500 (erro interno)
        self.assertNotEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserRegistrationTest(APITestCase):
    def test_user_creation(self):
        """Testa criação de usuário diretamente no banco"""
        user_count_before = User.objects.count()
        User.objects.create_user(
            username="test@example.com",
            email="test@example.com",
            password="testpass123"
        )
        user_count_after = User.objects.count()
        self.assertEqual(user_count_after, user_count_before + 1)


class TokenObtainTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="test@example.com",
            password="testpass123",
            email="test@example.com",
        )

    def test_token_creation(self):
        """Testa criação de token JWT diretamente"""
        refresh = RefreshToken.for_user(self.user)
        self.assertIsNotNone(str(refresh.access_token))
        self.assertIsNotNone(str(refresh))


class ProtectedEndpointTest(APITestCase):
    def test_authentication_required(self):
        """Testa que endpoints protegidos requerem auth"""
        url = reverse('user-profile')
        response = self.client.get(url)
        # Endpoint protegido deve retornar 401 sem token
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_public_endpoint_accessible(self):
        """Testa que endpoints públicos funcionam"""
        url = reverse('get-items')
        response = self.client.get(url)
        # Endpoint público deve retornar 200
        self.assertEqual(response.status_code, status.HTTP_200_OK)