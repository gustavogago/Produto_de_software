from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Category, City, Item, UserProfile
from api.serializers import (
    UserSerializer, 
    CategorySerializer, 
    CitySerializer, 
    ItemSerializer,
    UserCreateSerializer,
    UserProfileSerializer
)
import uuid


class SerializerTests(TestCase):
    def setUp(self):
        self.user_data = {
            'email': 'serializer_test@example.com',
            'password': 'testpass123',
            'first_name': 'Serializer',
            'last_name': 'Test'
        }
        self.category = Category.objects.create(name="Roupas", slug="roupas")
        self.city = City.objects.create(name="Belo Horizonte", state="MG")

    def test_user_create_serializer(self):
        """Testa UserCreateSerializer"""
        serializer = UserCreateSerializer(data=self.user_data)
        self.assertTrue(serializer.is_valid())
        
        user = serializer.save()
        self.assertEqual(user.email, 'serializer_test@example.com')
        self.assertEqual(user.username, 'serializer_test@example.com')
        
        # Verifica que o profile foi criado
        self.assertTrue(UserProfile.objects.filter(user=user).exists())

    def test_user_serializer(self):
        """Testa UserSerializer"""
        user = User.objects.create_user(
            username="user_serializer@example.com",
            email="user_serializer@example.com",
            password="testpass123"
        )
        UserProfile.objects.create(user=user)
        
        serializer = UserSerializer(instance=user)
        data = serializer.data
        
        self.assertEqual(data['email'], 'user_serializer@example.com')
        self.assertIn('profile', data)

    def test_category_serializer(self):
        """Testa CategorySerializer"""
        serializer = CategorySerializer(instance=self.category)
        data = serializer.data
        self.assertEqual(data['name'], 'Roupas')
        self.assertEqual(data['slug'], 'roupas')

    def test_city_serializer(self):
        """Testa CitySerializer"""
        serializer = CitySerializer(instance=self.city)
        data = serializer.data
        self.assertEqual(data['name'], 'Belo Horizonte')
        self.assertEqual(data['state'], 'MG')

    def test_item_serializer(self):
        """Testa ItemSerializer"""
        user = User.objects.create_user(
            username="item_serializer@example.com",
            email="item_serializer@example.com",
            password="testpass123"
        )
        
        item = Item.objects.create(
            user=user,
            title="Item Teste",
            description="Descrição teste",
            category=self.category,
            city=self.city,
            status="new"
        )
        
        serializer = ItemSerializer(instance=item)
        data = serializer.data
        
        self.assertEqual(data['title'], 'Item Teste')
        self.assertEqual(data['category_name'], 'Roupas')
        self.assertEqual(data['status'], 'new')

    def test_user_profile_serializer(self):
        """Testa UserProfileSerializer"""
        user = User.objects.create_user(username="profile_serializer@example.com")
        profile = UserProfile.objects.create(user=user)
        
        serializer = UserProfileSerializer(instance=profile)
        data = serializer.data
        
        self.assertEqual(data['notifications_enabled'], True)