from rest_framework import viewsets
from voluntarios.permissoes import IsVoluntarioLogado
from .models import Deficiencia
from .serializers import DeficienciaSerializer

class DeficienciaViewSet(viewsets.ModelViewSet):
    queryset = Deficiencia.objects.all()
    serializer_class = DeficienciaSerializer
    authentication_classes = []
    permission_classes = [IsVoluntarioLogado]
