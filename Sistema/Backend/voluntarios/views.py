from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Voluntario
from .serializers import VoluntarioSerializer

class VoluntarioViewSet(viewsets.ModelViewSet):
    queryset = Voluntario.objects.all()
    serializer_class = VoluntarioSerializer

    def destroy(self, request, *args, **kwargs):
        voluntario = self.get_object()
        
        voluntario.delete() 
        
        return Response(
            {'mensagem': 'Voluntário inativado com sucesso'}, 
            status=status.HTTP_204_NO_CONTENT
        )