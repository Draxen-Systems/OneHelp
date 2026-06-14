from django.db import models
from core.models import Deficiencia # <--- Importando do Core!

class Especie(models.Model):
    nome = models.CharField(max_length=50, unique=True)
    def __str__(self): return self.nome

class Raca(models.Model):
    nome = models.CharField(max_length=50)
    especie = models.ForeignKey(Especie, on_delete=models.PROTECT, related_name="racas")
    def __str__(self): return f"{self.nome} ({self.especie.nome})"

class Animal(models.Model):
    SEXO_CHOICES = [('M', 'Macho'), ('F', 'Fêmea')]
    PORTE_CHOICES = [('P', 'Pequeno'), ('M', 'Médio'), ('G', 'Grande')]
    STATUS_CHOICES = [
        ('Disponivel', 'Disponível'), ('Tratamento', 'Em Tratamento'),
        ('Adotado', 'Adotado'), ('Obito', 'Óbito')
    ]

    nome = models.CharField(max_length=100)
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES)
    porte = models.CharField(max_length=1, choices=PORTE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Disponivel')
    
    data_resgate = models.DateField()
    castrado = models.BooleanField(default=False)
    ativo = models.BooleanField(default=True)
    
    observacao = models.TextField(blank=True, null=True)
    historia = models.TextField() 
    foto = models.ImageField(upload_to='fotos_animais/')

    especie = models.ForeignKey(Especie, on_delete=models.PROTECT, related_name="animais")
    raca = models.ForeignKey(Raca, on_delete=models.PROTECT, related_name="animais")
    
    # Fazendo a ligação com a tabela que está no app Core!
    deficiencias = models.ManyToManyField(Deficiencia, blank=True)

    def __str__(self): return self.nome