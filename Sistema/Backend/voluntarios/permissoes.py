from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import AccessToken

class IsVoluntarioLogado(BasePermission):
    """
    Regra simples: O usuário só acessa se enviar um Token JWT válido no Cabeçalho (Header).
    """
    def has_permission(self, request, view):
        # 1. Pega a chave que o FrontEnd (ou o Teste) enviou
        auth_header = request.headers.get('Authorization')
        
        # Se não enviou nada, ou enviou errado, bloqueia na hora (False)
        if not auth_header or not auth_header.startswith('Bearer '):
            return False
            
        try:
            # 2. Pega só a parte do token (ex: Bearer eyJhbGciOi...)
            token = auth_header.split(' ')[1]
            
            # 3. Tenta ler o Token. O Django valida matematicamente se ele não é falso ou expirado
            token_decodificado = AccessToken(token)
            
            # 4. Confirma se é o nosso token (se tem o voluntario_id que guardámos no login)
            if 'voluntario_id' in token_decodificado:
                return True
                
            return False
            
        except Exception:
            # Se o token estiver expirado ou for inventado, cai aqui e bloqueia
            return False