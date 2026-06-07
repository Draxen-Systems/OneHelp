from rest_framework import viewsets
from .models import Adotante, Endereco
from .serializers import AdotanteSerializer, EnderecoSerializer


class EnderecoViewSet(viewsets.ModelViewSet):
    queryset = Endereco.objects.all()
    serializer_class = EnderecoSerializer


class AdotanteViewSet(viewsets.ModelViewSet):
    queryset = Adotante.objects.all()
    serializer_class = AdotanteSerializer
