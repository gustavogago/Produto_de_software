# api/tests.py
import uuid
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .models import Item, Category, City

class ItemsApiTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # usuários
        self.user = User.objects.create_user(username="u1", password="pass1234")
        self.other = User.objects.create_user(username="u2", password="pass1234")

        # categorias
        self.cat1 = Category.objects.create(name="Eletrônicos", slug="eletronicos")
        self.cat2 = Category.objects.create(name="Móveis", slug="moveis")

        # cidade (opcional)
        self.city = City.objects.create(name="Porto Alegre", state="RS")

        # itens do user logado
        self.item_u1_a = Item.objects.create(
            user=self.user, title="Notebook", description="i5",
            category=self.cat1, city=self.city, status="new",
            listing_state="active", created_at=timezone.now()
        )
        self.item_u1_b = Item.objects.create(
            user=self.user, title="Sofá", description="2 lugares",
            category=self.cat2, city=self.city, status="used",
            listing_state="active", created_at=timezone.now()
        )

        # itens de outro usuário (não devem aparecer para u1)
        self.item_u2 = Item.objects.create(
            user=self.other, title="Câmera", description="Mirrorless",
            category=self.cat1, city=self.city, status="used",
            listing_state="active", created_at=timezone.now()
        )

        # endpoints
        self.list_url = reverse("items")  # "items/" no urls.py
        self.detail_url_u1a = reverse("item-detail", kwargs={"pk": self.item_u1_a.pk})

    def test_list_requires_auth(self):
        # sem autenticação -> 401 (porque mantivemos IsAuthenticated)
        resp = self.client.get(self.list_url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_returns_only_logged_user_items_with_pagination(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get(self.list_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # resposta paginada DRF: count/next/previous/results
        self.assertIn("count", resp.data)
        self.assertIn("results", resp.data)

        # somente itens do user autenticado
        titles = [it["title"] for it in resp.data["results"]]
        self.assertIn("Notebook", titles)
        self.assertIn("Sofá", titles)
        self.assertNotIn("Câmera", titles)  # pertence ao outro user

    def test_filter_by_category_slug(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get(f"{self.list_url}?category=eletronicos")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        titles = [it["title"] for it in resp.data["results"]]
        self.assertIn("Notebook", titles)
        self.assertNotIn("Sofá", titles)

    def test_filter_by_category_uuid(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get(f"{self.list_url}?category={self.cat2.id}")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        titles = [it["title"] for it in resp.data["results"]]
        self.assertIn("Sofá", titles)
        self.assertNotIn("Notebook", titles)

    def test_retrieve_requires_auth(self):
        resp = self.client.get(self.detail_url_u1a)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_own_item(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get(self.detail_url_u1a)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "Notebook")

    def test_cannot_see_others_item(self):
        self.client.force_authenticate(user=self.user)
        foreign_detail = reverse("item-detail", kwargs={"pk": self.item_u2.pk})
        resp = self.client.get(foreign_detail)
        # queryset filtra por user=self.request.user -> item de outro user vira 404
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_item_sets_user(self):
        # Este teste PASSA se 'user' estiver em read_only_fields do serializer.
        self.client.force_authenticate(user=self.user)
        payload = {
            "title": "TV 50",
            "description": "Smart",
            "category": str(self.cat1.id),  # FK por UUID em string
            "city": str(self.city.id),
            "status": "new",
            "listing_state": "active",
        }
        resp = self.client.post(self.list_url, data=payload, format="json")
        # Se o serializer exigir 'user', isso vai ser 400. Para passar, use read_only_fields no serializer.
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["user"], self.user.id)
