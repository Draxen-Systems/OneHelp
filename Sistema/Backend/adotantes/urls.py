from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdotanteViewSet, EnderecoViewSet

router = DefaultRouter()
router.register(r'adotantes', AdotanteViewSet)
router.register(r'enderecos', EnderecoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
