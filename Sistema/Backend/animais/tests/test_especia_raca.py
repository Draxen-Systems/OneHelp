from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.test import TestCase
from django.db.models import ProtectedError
from django.db import IntegrityError

# Ajuste a importação para o nome correto do seu app (ex: animais.models)
from animais.models import Especie, Raca

# ==========================================
# TESTES DE API (DRF)
# ==========================================

class EspecieAPITestCase(APITestCase):
    def setUp(self):
        self.url_list = reverse('especie-list')
        self.payload = {"nome": "Canina"}

    def test_post_valido_criar_especie(self):
        # API: Criar espécie válida retorna 201
        resposta = self.client.post(self.url_list, self.payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Especie.objects.count(), 1)
        self.assertEqual(resposta.data['nome'], "Canina")

    def test_post_invalido_sem_nome(self):
        # API: Campo nome é obrigatório
        resposta = self.client.post(self.url_list, {}, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nome', resposta.data)

    def test_post_invalido_nome_duplicado(self):
        # API: Espécie possui unique=True, não pode repetir nome
        Especie.objects.create(nome="Felina")
        
        resposta = self.client.post(self.url_list, {"nome": "Felina"}, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nome', resposta.data) # O erro deve apontar para o campo nome


class RacaAPITestCase(APITestCase):
    def setUp(self):
        self.url_list = reverse('raca-list')
        self.especie = Especie.objects.create(nome="Canina")
        self.payload = {
            "nome": "Golden Retriever",
            "especie": self.especie.id
        }

    def test_post_valido_criar_raca(self):
        # API: Criar raça vinculada a uma espécie retorna 201
        resposta = self.client.post(self.url_list, self.payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Raca.objects.count(), 1)
        self.assertEqual(resposta.data['nome'], "Golden Retriever")

    def test_post_invalido_sem_especie(self):
        # API: Raça não pode ficar "órfã", espécie é obrigatória
        payload_invalido = {"nome": "Pug"} # Sem passar a FK
        resposta = self.client.post(self.url_list, payload_invalido, format='json')
        
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('especie', resposta.data)


# ==========================================
# TESTES DE MODELO (BANCO DE DADOS DIRETO)
# ==========================================

class RacaEspecieModelTestCase(TestCase):
    def setUp(self):
        self.especie = Especie.objects.create(nome="Felina")
        self.raca = Raca.objects.create(nome="Siamês", especie=self.especie)

    def test_modelo_especie_unica(self):
        # MODELO: Garante que o banco levanta IntegrityError se tentar burlar o unique
        with self.assertRaises(IntegrityError):
            Especie.objects.create(nome="Felina")

    def test_modelo_on_delete_protect(self):
        # MODELO: Testa a trava de segurança models.PROTECT
        # Se tentarmos apagar a espécie "Felina" que já tem um "Siamês" vinculado, o banco DEVE proibir.
        with self.assertRaises(ProtectedError):
            self.especie.delete()
        
        # Garante que a espécie continua a salvo no banco
        self.assertEqual(Especie.objects.count(), 1)