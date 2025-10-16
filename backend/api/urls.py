from django.urls import path
from . import views

urlpatterns = [
    # lista + criação
    path("items/", views.ItemListCreateView.as_view(), name="items"),

    # detalhe / update / delete por UUID
    path("items/<uuid:pk>/", views.ReadItemView.as_view(), name="item-detail"),
    path("items/<uuid:pk>/update/", views.UpdateItemView.as_view(), name="item-update"),
    path("items/<uuid:pk>/delete/", views.DeleteItemView.as_view(), name="item-delete"),
]
