from rest_framework import serializers
from .models import Deficiencia

class DeficienciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deficiencia
        fields = '__all__' 