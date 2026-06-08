from django.contrib import admin
from .models import Adotante, Endereco


@admin.register(Endereco)
class EnderecoAdmin(admin.ModelAdmin):
    list_display = ('rua', 'bairro', 'uf', 'cep')
    search_fields = ('cep', 'rua', 'bairro')


@admin.register(Adotante)
class AdotanteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'email', 'telefone', 'status')
    list_filter = ('status', 'tipo_residencia')
    search_fields = ('nome', 'cpf', 'email')
