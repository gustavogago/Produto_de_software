from django.urls import path
from . import views

urlpatterns = [
    path("items/", views.CreateItemView.as_view(), name="note-list"),
    path("items/delete/<int:pk>/", views.DeleteItemView.as_view(), name="delete-note"),
    path("item/update/<int:pk>/", views.UpdateItemView.as_view(), name="update-note"),
    path("items/<int:pk>/", views.ReadItemView.as_view(), name="note-detail"),
]