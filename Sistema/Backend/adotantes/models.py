from django.db import models
from core.models import Deficiencia


class Endereco(models.Model):
    rua = models.CharField(max_length=255)
    bairro = models.CharField(max_length=100)
    uf = models.CharField(max_length=2)
    cep = models.CharField(max_length=8)

    def __str__(self):
        return f"{self.rua}, {self.bairro} - {self.uf}"


class Adotante(models.Model):
    TIPO_RESIDENCIA_CHOICES = [
        ("C", "Casa"),
        ("A", "Apartamento"),
        ("CH", "Chácara"),
    ]


    STATUS_CHOICES = [
        ("ATIVO", "Ativo"),
        ("INATIVO", "Inativo"),
    ]

    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=11, unique=True)  # RN03
    telefone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    nascimento = models.DateField()
    pessoas = models.IntegerField()
    foto = models.ImageField(upload_to='adotantes/', null=True, blank=True)
    tipo_residencia = models.CharField(max_length=2, choices=TIPO_RESIDENCIA_CHOICES)
    observacoes = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ATIVO')  # RN10

    endereco = models.ForeignKey(Endereco, on_delete=models.PROTECT, related_name='adotantes')
    deficiencias = models.ManyToManyField(Deficiencia, blank=True, related_name='adotantes')

    def delete(self, *args, **kwargs):
        # RN10: Exclusão Lógica
        self.status = "INATIVO"
        self.save()

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Adotante"
        verbose_name_plural = "Adotantes"
