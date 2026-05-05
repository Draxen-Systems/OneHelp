from django.urls import path
from . import views

urlpatterns = [
    path('', views.listar_funcionarios, name='listar_funcionarios'),
    path('editar/<int:id>/', views.editar_funcionario, name='editar_funcionario'),
    path('deletar/<int:id>/', views.deletar_funcionario, name='deletar_funcionario'),
]
