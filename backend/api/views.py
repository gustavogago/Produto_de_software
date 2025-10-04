from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Item
from .serializers import ItemSerializer
from rest_framework import generics, permissions





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
    
#Classe para a visualização do perfil
class UserProfileView(generics.RetrieveAPIView):
    #responsavel por pegar as infos do banco e tranformar m json
    serializer_class = UserSerializer
    #Faz a validação se o usuario esta autenticado
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        #resposta GET
        return self.request.user


class UserUpdateView(generics.UpdateAPIView):
    #responsavel por pegar as infos do banco e tranformar m json
    serializer_class = UserSerializer
    #Faz a validação se o usuario esta autenticado
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
