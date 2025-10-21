from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, UserProfileView, UserProfileUpdateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

#Faz a configuração das rotas a partir das URLS
urlpatterns = [
    path("admin/", admin.site.urls),
    #path("api/health/", health_check, name='health_check'),  # Adicione esta linha
    path("api/users/register/", CreateUserView.as_view(), name="register"),
    path("api/users/login/", TokenObtainPairView.as_view(), name="login"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/users/", include("api.urls")),
    path("items/", include("api.urls")),  
]