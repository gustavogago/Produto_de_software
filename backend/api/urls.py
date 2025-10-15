from django.urls import path

from . import views
from .views import UserProfileUpdateView, UserProfileView

urlpatterns = [
    path("items/", views.CreateItemView.as_view(), name="note-list"),
    path("items/delete/<int:pk>/", views.DeleteItemView.as_view(), name="delete-note"),
    path("items/update/<int:pk>/", views.UpdateItemView.as_view(), name="update-note"),
    path("items/<int:pk>/", views.ReadItemView.as_view(), name="note-detail"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("profile/update/", UserProfileUpdateView.as_view(), name="user-update"),
]
