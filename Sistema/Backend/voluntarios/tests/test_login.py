from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


# Importe o model Voluntario de onde ele estiver (ex: pessoas.models, core.models)
from voluntarios.models import Voluntario

class LoginAPITestCase(APITestCase):

    def setUp(self):
        self.url_login = reverse('api-login')
        self.voluntario_ativo = Voluntario.objects.create(
            nome="João Ativo", cpf="111.222.333-44", email="joao@ong.com",
            funcao="Resgatista", login="joao.ativo", senha_hash="senha123",
            status="ATIVO", nivel_acesso="VOLUNTARIO"
        )
        self.voluntario_inativo = Voluntario.objects.create(
            nome="Maria Inativa", cpf="999.888.777-66", email="maria@ong.com",
            funcao="Veterinária", login="maria.inativa", senha_hash="senha123",
            status="INATIVO", nivel_acesso="VETERINARIO"
        )


    def test_tdd01_login_sucesso(self):
        # TDD01: Credenciais corretas devem retornar 200 OK e os Tokens JWT
        payload = {"login": "joao.ativo", "senha": "senha123"}
        resposta = self.client.post(self.url_login, payload, format='json')
        
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertIn('access', resposta.data)  # Garante que o Token foi gerado
        self.assertIn('refresh', resposta.data)
        self.assertEqual(resposta.data['usuario']['nome'], "João Ativo")

    def test_tdd02_login_sem_credenciais(self):
        # TDD02: Requisição vazia ou faltando campos deve retornar 400
        resposta_vazia = self.client.post(self.url_login, {}, format='json')
        self.assertEqual(resposta_vazia.status_code, status.HTTP_400_BAD_REQUEST)

        resposta_sem_senha = self.client.post(self.url_login, {"login": "joao.ativo"}, format='json')
        self.assertEqual(resposta_sem_senha.status_code, status.HTTP_400_BAD_REQUEST)

    def test_tdd03_login_senha_incorreta(self):
        # TDD03: Senha errada deve retornar 401 Unauthorized
        payload = {"login": "joao.ativo", "senha": "senha_errada_456"}
        resposta = self.client.post(self.url_login, payload, format='json')
        
        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resposta.data['erro'], 'Credenciais inválidas.')

    def test_tdd04_login_usuario_inexistente(self):
        # TDD04: Login que não existe no banco retorna 401
        payload = {"login": "fantasma", "senha": "123"}
        resposta = self.client.post(self.url_login, payload, format='json')
        
        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_tdd05_login_usuario_inativo_bloqueado(self):
        # TDD05: Se o usuário sofreu Soft Delete (INATIVO), não pode logar!
        payload = {"login": "maria.inativa", "senha": "senha123"}
        resposta = self.client.post(self.url_login, payload, format='json')
        
        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resposta.data['erro'], 'Credenciais inválidas ou voluntário inativo.')