from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated  
from .models import Adotante, Endereco
from .serializers import AdotanteSerializer, EnderecoSerializer
from voluntarios.permissoes import IsVoluntarioLogado


class EnderecoViewSet(viewsets.ModelViewSet):
    queryset = Endereco.objects.all()
    serializer_class = EnderecoSerializer
    authentication_classes = []
    permission_classes = [IsVoluntarioLogado]

class AdotanteViewSet(viewsets.ModelViewSet):
    queryset = Adotante.objects.all()
    serializer_class = AdotanteSerializer
    authentication_classes = []
    permission_classes = [IsVoluntarioLogado]
