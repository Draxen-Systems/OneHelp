from django.db import models

class Deficiencia(models.Model):
    nome = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nome