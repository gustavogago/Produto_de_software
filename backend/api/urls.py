from django.urls import path
from .views import health_check, CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path("health/", health_check, name="health_check"),
    path("users/register/", CreateUserView.as_view(), name="user_register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
]
