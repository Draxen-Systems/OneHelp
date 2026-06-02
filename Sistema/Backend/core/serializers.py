from rest_framework import serializers
from .models import Deficiencia

class DeficienciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deficiencia
        fields = '__all__' # O '__all__' diz ao Django para transformar todos os campos (id, nome) em JSON