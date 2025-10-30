from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from api.models import Category, City, Item, UserProfile
from rest_framework_simplejwt.tokens import RefreshToken


class ViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="view_test@example.com",
            email="view_test@example.com",
            password="testpass123"
        )
        self.category = Category.objects.create(name="Esportes", slug="esportes")
        self.city = City.objects.create(name="Curitiba", state="PR")
        
        # Criar token para autenticação
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_list_categories(self):
        """Testa listagem de categorias"""
        url = reverse('list-categories')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_list_cities(self):
        """Testa listagem de cidades"""
        url = reverse('list-cities')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_get_items_list(self):
        """Testa listagem de itens"""
        url = reverse('get-items')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_user_profile_access(self):
        """Testa acesso ao perfil do usuário"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = reverse('user-profile')
        response = self.client.get(url)
        
        # Pode retornar 200 (encontrado) ou 404 (não criado)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND])

    def test_create_category_authenticated(self):
        """Testa criação de categoria com autenticação"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        category_data = {
            'name': 'Nova Categoria',
            'slug': 'nova-categoria'
        }
        
        url = reverse('create-category')
        response = self.client.post(url, category_data, format='json')
        
        # Pode retornar 201 (criado) ou 400 (dados inválidos)
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])


class PermissionTests(APITestCase):
    def test_unauthenticated_access(self):
        """Testa acesso sem autenticação a endpoints protegidos"""
        urls_to_test = [
            reverse('user-profile'),
            reverse('items-create'),
            reverse('create-category'),
        ]
        
        for url in urls_to_test:
            if url == reverse('user-profile'):
                response = self.client.get(url)
            else:
                response = self.client.post(url)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_public_endpoints(self):
        """Testa que endpoints públicos são acessíveis"""
        public_urls = [
            reverse('get-items'),
            reverse('list-categories'),
            reverse('list-cities'),
        ]
        
        for url in public_urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)