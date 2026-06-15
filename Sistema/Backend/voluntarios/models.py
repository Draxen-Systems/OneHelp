from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password

class Voluntario(models.Model):
    # RN05: Opções para Status
    STATUS_CHOICES = [
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
        ('AFASTADO', 'Afastado'),
    ]
    
    # RN06: Nível de acesso obrigatório (mantendo os exemplos do PO)
    NIVEL_ACESSO_CHOICES = [
        ('ADMINISTRADOR', 'Administrador'),
        ('VOLUNTARIO', 'Voluntário'),
        ('VETERINARIO', 'Veterinário'),
    ]

    # Campos principais
    nome = models.CharField(max_length=255) # RN07: Nome obrigatório
    cpf = models.CharField(max_length=14, unique=True) # RN01: CPF único
    telefone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(unique=True) # RN02: E-mail único
    endereco = models.TextField(null=True, blank=True)
    funcao = models.CharField(max_length=100)
    data_entrada = models.DateField(default=timezone.now) # RN08: Data obrigatória
    
    # RN05: Status obrigatório e não nulo
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='ATIVO'
    )
    
    # RN06: Nível de acesso obrigatório e não nulo
    nivel_acesso = models.CharField(
        max_length=20, 
        choices=NIVEL_ACESSO_CHOICES, 
        default='VOLUNTARIO'
    )

    # RN03: Login único (tornado obrigatório, sem null/blank)
    login = models.CharField(max_length=50, unique=True) 
    
    # RN04: Senha armazenada com segurança (tornada obrigatória)
    senha_hash = models.CharField(max_length=255) 
    
    observacoes = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # RN04: A senha não deve ser salva em texto puro (Hashing)
        if self.senha_hash and not self.senha_hash.startswith('pbkdf2_sha256$'):
            self.senha_hash = make_password(self.senha_hash)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # RN09: Exclusão preferencialmente lógica
        self.status = 'INATIVO'
        self.save()

    def __str__(self):
        return f"{self.nome} - {self.funcao}"