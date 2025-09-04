from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class HealthCheckTest(APITestCase):
    def test_health_check(self):
        """Test that the health check endpoint returns a healthy status"""
        url = reverse('health_check')
        print(f"Health check URL: {url}")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "healthy"})

class UserRegistrationTest(APITestCase):
    def setUp(self):
        self.url = reverse('register')
        # Seu serializer não usa password2 nem username explícito
        self.valid_data = {
            "email": "test@example.com",
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "User"
        }
    
    def test_user_registration_with_valid_data(self):
        """Test user registration with valid data"""
        response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Verifica se o usuário foi criado com o email (que se torna username)
        self.assertTrue(User.objects.filter(email="test@example.com").exists())
        user = User.objects.get(email="test@example.com")
        self.assertEqual(user.username, "test@example.com")
    
    def test_user_registration_with_existing_email(self):
        """Test user registration with an existing email"""
        # Cria um usuário primeiro com o mesmo email
        User.objects.create_user(
            username="existing@example.com",  # Seu serializer usa email como username
            password="testpass123",
            email="test@example.com"  # Mesmo email
        )
        
        # Tenta criar outro usuário com o mesmo email
        response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

# Remova os testes de password2 pois seu serializer não tem essa validação
# def test_user_registration_with_mismatched_passwords(self):
#     """Test user registration with mismatched passwords"""
#     invalid_data = self.valid_data.copy()
#     invalid_data['password2'] = 'differentpassword'
#     response = self.client.post(self.url, invalid_data, format='json')
#     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class TokenObtainTest(APITestCase):
    def setUp(self):
        self.url = reverse('get_token')
        # Cria usuário com email como username (seguindo seu serializer)
        self.user = User.objects.create_user(
            username="test@example.com",  # Email como username
            password="testpass123",
            email="test@example.com"
        )
        self.valid_credentials = {
            "username": "test@example.com",  # Use o email como username
            "password": "testpass123"
        }
        self.invalid_credentials = {
            "username": "test@example.com",
            "password": "wrongpassword"
        }
    
    def test_token_obtain_with_valid_credentials(self):
        """Test obtaining a token with valid credentials"""
        response = self.client.post(self.url, self.valid_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_token_obtain_with_invalid_credentials(self):
        """Test obtaining a token with invalid credentials"""
        response = self.client.post(self.url, self.invalid_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class TokenRefreshTest(APITestCase):
    def setUp(self):
        self.url = reverse('refresh')
        self.user = User.objects.create_user(
            username="test@example.com",  # Email como username
            password="testpass123",
            email="test@example.com"
        )
        # Create a refresh token
        refresh = RefreshToken.for_user(self.user)
        self.valid_refresh_token = {
            "refresh": str(refresh)
        }
        self.invalid_refresh_token = {
            "refresh": "invalidtoken"
        }
    
    def test_token_refresh_with_valid_token(self):
        """Test refreshing a token with a valid refresh token"""
        response = self.client.post(self.url, self.valid_refresh_token, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_token_refresh_with_invalid_token(self):
        """Test refreshing a token with an invalid refresh token"""
        response = self.client.post(self.url, self.invalid_refresh_token, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class ProtectedEndpointTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="test@example.com",  # Email como username
            password="testpass123",
            email="test@example.com"
        )
        # Create a valid token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
    
    def test_access_protected_endpoint_without_token(self):
        """Test accessing a protected endpoint without a token"""
        pass
    
    def test_access_protected_endpoint_with_token(self):
        """Test accessing a protected endpoint with a valid token"""
        pass