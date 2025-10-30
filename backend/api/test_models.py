from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Category, City, Item, UserProfile, ItemPhoto, Notification
import uuid


class ModelTests(TestCase):
    def test_category_creation(self):
        """Testa criação de Category com slug"""
        category = Category.objects.create(name="Eletrônicos", slug="eletronicos")
        self.assertEqual(category.name, "Eletrônicos")
        self.assertEqual(category.slug, "eletronicos")
        self.assertEqual(str(category), "Eletrônicos")

    def test_city_creation(self):
        """Testa criação de City"""
        city = City.objects.create(name="São Paulo", state="SP")
        self.assertEqual(city.name, "São Paulo")
        self.assertEqual(city.state, "SP")
        self.assertEqual(str(city), "São Paulo (SP)")

    def test_city_creation_without_state(self):
        """Testa criação de City sem state"""
        city = City.objects.create(name="São Paulo")
        self.assertEqual(str(city), "São Paulo")

    def test_item_creation(self):
        """Testa criação de Item com campos obrigatórios"""
        user = User.objects.create_user(
            username="item_test@example.com",
            email="item_test@example.com",
            password="testpass123"
        )
        category = Category.objects.create(name="Livros", slug="livros")
        city = City.objects.create(name="Rio de Janeiro", state="RJ")
        
        item = Item.objects.create(
            user=user,
            title="Livro de Django",
            description="Livro sobre framework Django",
            category=category,
            city=city,
            status="new"  # Campo obrigatório
        )
        
        self.assertEqual(item.title, "Livro de Django")
        self.assertEqual(item.user.username, "item_test@example.com")
        self.assertEqual(item.status, "new")
        self.assertEqual(item.listing_state, "active")  # Valor default

    def test_user_profile_creation(self):
        """Testa criação de UserProfile"""
        user = User.objects.create_user(
            username="profile_test@example.com",
            email="profile_test@example.com",
            password="testpass123"
        )
        profile = UserProfile.objects.create(user=user)
        self.assertEqual(profile.user.username, "profile_test@example.com")
        self.assertEqual(profile.notifications_enabled, True)  # Valor default
        self.assertEqual(str(profile), "Profile for profile_test@example.com")

    def test_item_photo_creation(self):
        """Testa criação de ItemPhoto"""
        user = User.objects.create_user(username="photo_test@example.com")
        category = Category.objects.create(name="Test", slug="test")
        item = Item.objects.create(
            user=user,
            title="Item com foto",
            category=category,
            status="new"
        )
        
        photo = ItemPhoto.objects.create(
            item=item,
            position=1
        )
        
        self.assertEqual(photo.item.title, "Item com foto")
        self.assertEqual(photo.position, 1)

    def test_notification_creation(self):
        """Testa criação de Notification"""
        user = User.objects.create_user(username="notif_test@example.com")
        notification = Notification.objects.create(
            user=user,
            notification_type="system",
            message="Test notification"
        )
        
        self.assertEqual(notification.user.username, "notif_test@example.com")
        self.assertEqual(notification.notification_type, "system")
        self.assertEqual(notification.is_read, False)  # Valor default