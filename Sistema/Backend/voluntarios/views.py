from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Voluntario
from .serializers import VoluntarioSerializer
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .permissoes import IsVoluntarioLogado  
from .models import Voluntario

class VoluntarioViewSet(viewsets.ModelViewSet):
    authentication_classes = []
    queryset = Voluntario.objects.all()
    serializer_class = VoluntarioSerializer
    permission_classes = [IsVoluntarioLogado]


    def destroy(self, request, *args, **kwargs):
        voluntario = self.get_object()
        
        voluntario.delete() 
        
        return Response(
            {'mensagem': 'Voluntário inativado com sucesso'}, 
            status=status.HTTP_204_NO_CONTENT
        )



class LoginVoluntarioView(APIView):
    """
    View customizada para autenticar Voluntários e gerar o Token JWT.
    """
    # Liberamos essa rota específica para não exigir token (afinal, é aqui que ele pega o token!)
    permission_classes = [] 
    authentication_classes = []


    def post(self, request):
        login_informado = request.data.get('login')
        senha_informada = request.data.get('senha')

        # 1. Validação básica
        if not login_informado or not senha_informada:
            return Response(
                {'erro': 'Por favor, informe login e senha.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Busca o voluntário no banco (já garantindo que ele não foi excluído logicamente)
        try:
            voluntario = Voluntario.objects.get(login=login_informado, status='ATIVO')
        except Voluntario.DoesNotExist:
            return Response(
                {'erro': 'Credenciais inválidas ou voluntário inativo.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        # 3. Verifica se a senha bate com o Hash do banco
        if not check_password(senha_informada, voluntario.senha_hash):
            return Response(
                {'erro': 'Credenciais inválidas.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        # 4. Sucesso! Geramos o Token JWT e embutimos informações úteis dentro dele
        refresh = RefreshToken()
        refresh['voluntario_id'] = voluntario.id
        refresh['nome'] = voluntario.nome
        refresh['nivel_acesso'] = voluntario.nivel_acesso

        # 5. Retornamos os tokens e os dados básicos para o Frontend usar no Menu
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'usuario': {
                'id': voluntario.id,
                'nome': voluntario.nome,
                'nivel_acesso': voluntario.nivel_acesso
            }
        }, status=status.HTTP_200_OK)