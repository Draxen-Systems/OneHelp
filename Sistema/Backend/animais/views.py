from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from voluntarios.permissoes import IsVoluntarioLogado
from .models import Especie, Raca, Animal
from .serializers import EspecieSerializer, RacaSerializer, AnimalSerializer

class EspecieViewSet(viewsets.ModelViewSet):
    queryset = Especie.objects.all()
    serializer_class = EspecieSerializer
    authentication_classes = []
    permission_classes = [IsVoluntarioLogado]
    
class RacaViewSet(viewsets.ModelViewSet):
    queryset = Raca.objects.all()
    serializer_class = RacaSerializer
    authentication_classes = []
    permission_classes = [IsVoluntarioLogado]

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.filter(ativo=True) # Boas práticas: listar apenas os ativos
    serializer_class = AnimalSerializer
    authentication_classes = []
    permission_classes = [IsVoluntarioLogado]
    
    def destroy(self, request, *args, **kwargs):
        animal = self.get_object()
        animal.ativo = False
        animal.save()
        return Response({'mensagem': 'Animal inativado com sucesso'}, status=status.HTTP_204_NO_CONTENT)