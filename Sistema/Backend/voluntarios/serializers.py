from rest_framework import serializers
from .models import Voluntario

class VoluntarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voluntario
        fields = '__all__'
        extra_kwargs = {
            # Segurança máxima: a senha não será exposta nas listagens (GET)
            'senha_hash': {'write_only': True} 
        }