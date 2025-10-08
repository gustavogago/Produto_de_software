from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, UserCreateSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Item, UserProfile, Notification
from .serializers import ItemSerializer
from rest_framework import generics, permissions,status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserProfileSerializer
from django.http import Http404


class CreateUserView(generics.CreateAPIView):
    name = "Cadastro de Usuário"
    http_method_names = ["post"]
    description = "Endpoint for creating a new user."
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CreateItemView(generics.CreateAPIView):
    name = "Create Item"
    http_method_names = ["post"]
    description = "Endpoint for creating a new item."
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Item.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else: 
            print(serializer.errors)
    
class DeleteItemView(generics.DestroyAPIView):
    name = "Delete Item"
    http_method_names = ["delete"]
    description = "Endpoint for deleting an item."
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Item.objects.filter(author=user)

class UpdateItemView(generics.UpdateAPIView):
    name = "Update Item"
    http_method_names = ["put", "patch"]
    description = "Endpoint for updating an item."
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Item.objects.filter(author=user)

class ReadItemView(generics.RetrieveAPIView):
    name = "Read Item"
    http_method_names = ["get"]
    description = "Endpoint for reading an item."
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Item.objects.filter(author=user)
    
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({"error": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    name = "User and Profile Update"
    http_method_names = ["get", "put", "patch"]
    serializer_class = UserSerializer 
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user
    
class CreateUserView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer 
    permission_classes = [AllowAny]