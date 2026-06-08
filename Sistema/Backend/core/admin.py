from django.contrib import admin
from .models import Deficiencia


@admin.register(Deficiencia)
class DeficienciaAdmin(admin.ModelAdmin):
    list_display = ("id", "nome")
    search_fields = ("nome",)
