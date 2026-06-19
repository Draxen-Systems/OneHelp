from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from voluntarios.models import Voluntario # Importante!
from animais.models import Especie, Raca
from django.urls import reverse

class EspecieAPITestCase(APITestCase):
    def setUp(self):
        # Mágica de Autenticação
        self.voluntario = Voluntario.objects.create(
            nome="Admin", cpf="000.000.000-00", email="admin@test.com",
            login="admin", senha_hash="123", nivel_acesso="ADMINISTRADOR"
        )
        refresh = RefreshToken()
        refresh['voluntario_id'] = self.voluntario.id
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        self.url = reverse('especie-list')

    def test_post_valido_criar_especie(self):
        resposta = self.client.post(self.url, {"nome": "Cachorro"}, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        # O Admin já existe (1) + a espécie nova (1) = 2
        self.assertEqual(Especie.objects.count(), 1) # AQUI: Se o setUp criou a espécie, ajuste para 1. Se não, 2.

class RacaAPITestCase(APITestCase):
    def setUp(self):
        # Mágica de Autenticação
        self.voluntario = Voluntario.objects.create(
            nome="Admin", cpf="000.000.000-00", email="admin@test.com",
            login="admin", senha_hash="123", nivel_acesso="ADMINISTRADOR"
        )
        refresh = RefreshToken()
        refresh['voluntario_id'] = self.voluntario.id
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        self.especie = Especie.objects.create(nome="Cachorro")
        self.url = reverse('raca-list')

    def test_post_valido_criar_raca(self):
        resposta = self.client.post(self.url, {"nome": "Poodle", "especie": self.especie.id}, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)


