from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EspecieViewSet, RacaViewSet, AnimalViewSet

# O Router cria os links automaticamente!
router = DefaultRouter()
router.register(r'especies', EspecieViewSet)
router.register(r'racas', RacaViewSet)
router.register(r'animais', AnimalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]