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
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"status": "healthy"})

class UserRegistrationTest(APITestCase):
    def setUp(self):
        self.url = reverse('register')
        self.valid_data = {
            "username": "testuser",
            "password": "testpass123",
            "password2": "testpass123",
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User"
        }
    
    def test_user_registration_with_valid_data(self):
        """Test user registration with valid data"""
        response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())
    
    def test_user_registration_with_mismatched_passwords(self):
        """Test user registration with mismatched passwords"""
        invalid_data = self.valid_data.copy()
        invalid_data['password2'] = 'differentpassword'
        response = self.client.post(self.url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_user_registration_with_existing_username(self):
        """Test user registration with an existing username"""
        # Create a user first
        User.objects.create_user(
            username="testuser",
            password="testpass123",
            email="existing@example.com"
        )
        
        # Try to create another user with the same username
        response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class TokenObtainTest(APITestCase):
    def setUp(self):
        self.url = reverse('get_token')
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123",
            email="test@example.com"
        )
        self.valid_credentials = {
            "username": "testuser",
            "password": "testpass123"
        }
        self.invalid_credentials = {
            "username": "testuser",
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
            username="testuser",
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
            username="testuser",
            password="testpass123",
            email="test@example.com"
        )
        # Create a valid token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
    
    def test_access_protected_endpoint_without_token(self):
        """Test accessing a protected endpoint without a token"""
        # This is a placeholder test - you would need to create a protected endpoint
        # For example, if you had an endpoint at /api/protected/
        # response = self.client.get('/api/protected/')
        # self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        pass
    
    def test_access_protected_endpoint_with_token(self):
        """Test accessing a protected endpoint with a valid token"""
        # This is a placeholder test - you would need to create a protected endpoint
        # For example, if you had an endpoint at /api/protected/
        # self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        # response = self.client.get('/api/protected/')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        pass