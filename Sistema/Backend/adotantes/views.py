from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated  
from .models import Adotante, Endereco
from .serializers import AdotanteSerializer, EnderecoSerializer

class EnderecoViewSet(viewsets.ModelViewSet):
    queryset = Endereco.objects.all()
    serializer_class = EnderecoSerializer
    permission_classes = [IsAuthenticated] 

class AdotanteViewSet(viewsets.ModelViewSet):
    queryset = Adotante.objects.all()
    serializer_class = AdotanteSerializer
    permission_classes = [IsAuthenticated]