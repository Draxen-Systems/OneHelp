from django.db import models
from django.utils import timezone

class Funcionario(models.Model):
    # Opções para Status e Nível de Acesso (RN05 e RN06)
    STATUS_CHOICES = [
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
        ('AFASTADO', 'Afastado'),
    ]
    
    NIVEL_ACESSO_CHOICES = [
        ('ADMINISTRADOR', 'Administrador'),
        ('FUNCIONARIO', 'Funcionário'),
        ('VOLUNTARIO', 'Voluntário'),
        ('VETERINARIO', 'Veterinário'),
    ]

    # Campos principais
    nome = models.CharField(max_length=255) # RN07
    cpf = models.CharField(max_length=14, unique=True) # RN01
    telefone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(unique=True) # RN02
    endereco = models.TextField(null=True, blank=True)
    funcao = models.CharField(max_length=100)
    data_entrada = models.DateField(default=timezone.now) # RN08
    
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='ATIVO'
    )
    
    nivel_acesso = models.CharField(
        max_length=20, 
        choices=NIVEL_ACESSO_CHOICES, 
        default='FUNCIONARIO'
    )

    # Campos de autenticação (simplificados para o início)
    login = models.CharField(max_length=50, unique=True, null=True, blank=True) # RN03
    senha_hash = models.CharField(max_length=255, null=True, blank=True) # RN04 (placeholder)
    
    observacoes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.nome} - {self.funcao}"