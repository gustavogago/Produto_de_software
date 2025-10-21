from api.views import CreateUserView
from django.contrib import admin
<<<<<<< HEAD
from django.urls import path, include
from api.views import CreateUserView
=======
from django.urls import include, path
>>>>>>> 1aa3594 (refactor: Padronizando as URLs)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

#Faz a configuração das rotas a partir das URLS
urlpatterns = [
    path("admin/", admin.site.urls),
    #path("api/health/", health_check, name='health_check'),  # Adicione esta linha
    path("users/", include("api.urls")),
    path("users/register/", CreateUserView.as_view(), name="register"),
    path("users/login/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("", include("api.urls")),  
]