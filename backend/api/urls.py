from django.urls import path

from . import views
from .views import (
    CreateCategoryView,
    ListCategoriesView,
    ListCitiesView,
    UserProfileUpdateView,
    UserProfileView,
)

urlpatterns = [
    path("users/profile/", UserProfileView.as_view(), name="user-profile"),
    path("users/profile/update/", UserProfileUpdateView.as_view(), name="user-update"),
    path("items/", views.ReadItemsView.as_view(), name="get-items"),
    path("items/create/", views.CreateItemView.as_view(), name="items-create"),
    path("items/<uuid:pk>/", views.ReadItemView.as_view(), name="item-detail"),
    path("items/update/<uuid:pk>/", views.UpdateItemView.as_view(), name="update-item"),
    path("items/delete/<uuid:pk>/", views.DeleteItemView.as_view(), name="delete-item"),
    path("categories/", ListCategoriesView.as_view(), name="list-categories"),
    path("categories/create/", CreateCategoryView.as_view(), name="create-category"),
    path("cities/", ListCitiesView.as_view(), name="list-cities"),
]
