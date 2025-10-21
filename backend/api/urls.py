from django.urls import path

from . import views
from .views import (
    ListCategoriesView,
    ListCitiesView,
    UserProfileUpdateView,
    UserProfileView,
)

urlpatterns = [
    path("users/profile/", UserProfileView.as_view(), name="user-profile"),
    path("users/profile/update/", UserProfileUpdateView.as_view(), name="user-update"),
    path("items/create/", views.CreateItemView.as_view(), name="note-list"),
    path("items/delete/<int:pk>/", views.DeleteItemView.as_view(), name="delete-note"),
    path("items/update/<int:pk>/", views.UpdateItemView.as_view(), name="update-note"),
    path("items/<int:pk>/", views.ReadItemView.as_view(), name="note-detail"),
    path("categories/", ListCategoriesView.as_view(), name="list-categories"),
    path("cities/", ListCitiesView.as_view(), name="list-cities"),
]
