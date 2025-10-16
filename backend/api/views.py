from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination

from .models import Item
from .serializers import UserSerializer, ItemSerializer


class CreateUserView(generics.CreateAPIView):
    name = "Cadastro de Usuário"
    http_method_names = ["post"]
    description = "Endpoint for creating a new user."
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class DefaultPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 100


class ItemListCreateView(generics.ListCreateAPIView):
    """
    GET /api/items?category=<uuid|slug|name>&page=&page_size=
    POST /api/items
    """
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]         # mantém como você pediu
    pagination_class = DefaultPagination

    def get_queryset(self):
        # corrigido: 'author' -> 'user'
        qs = Item.objects.filter(user=self.request.user).order_by("-created_at")
        cat = self.request.query_params.get("category")
        if cat:
            qs = qs.filter(
                Q(category__id__iexact=cat) |
                Q(category__slug__iexact=cat) |
                Q(category__name__iexact=cat)
            )
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DeleteItemView(generics.DestroyAPIView):
    name = "Delete Item"
    http_method_names = ["delete"]
    description = "Endpoint for deleting an item."
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user)   # corrigido


class UpdateItemView(generics.UpdateAPIView):
    name = "Update Item"
    http_method_names = ["put", "patch"]
    description = "Endpoint for updating an item."
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user)   # corrigido


class ReadItemView(generics.RetrieveAPIView):
    name = "Read Item"
    http_method_names = ["get"]
    description = "Endpoint for reading an item."
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]                  # mantém como no seu padrão

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user)   # corrigido
