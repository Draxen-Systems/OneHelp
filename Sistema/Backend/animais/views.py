from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Especie, Raca, Animal
from .serializers import EspecieSerializer, RacaSerializer, AnimalSerializer

class EspecieViewSet(viewsets.ModelViewSet):
    queryset = Especie.objects.all()
    serializer_class = EspecieSerializer
    
class RacaViewSet(viewsets.ModelViewSet):
    queryset = Raca.objects.all()
    serializer_class = RacaSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    
    def destroy(self, request, *args, **kwargs):
            animal = self.get_object()
            animal.ativo = False
            animal.save()
            return Response({'mensagem': 'Animal inativado com sucesso'}, status=status.HTTP_204_NO_CONTENT)    