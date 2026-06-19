from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from animais.models import Animal, Especie, Raca
from core.models import Deficiencia
from rest_framework_simplejwt.tokens import RefreshToken # <-- Importamos o Gerador de Tokens
from voluntarios.models import Voluntario




_GIF_MINIMO = (
    b'GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff'
    b'!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01'
    b'\x00\x00\x02\x02D\x01\x00;'
)


def _foto():
    return SimpleUploadedFile("foto.gif", _GIF_MINIMO, content_type="image/gif")


# TESTES DE API

class AnimalAPITestCase(APITestCase):

    def setUp(self):
        # 1. Criamos um voluntário mestre para "logar"
        self.voluntario_logado = Voluntario.objects.create(
            nome="Admin Teste",
            cpf="000.000.000-00",
            email="admin@ong.com",
            funcao="Diretor",
            login="admin.teste",
            senha_hash="senha_admin",
            nivel_acesso="ADMINISTRADOR"
        )

        # 2. Geramos o Token e injetamos o ID (Exatamente o que a IsVoluntarioLogado procura!)
        refresh = RefreshToken()
        refresh['voluntario_id'] = self.voluntario_logado.id
        token = str(refresh.access_token)

        # 3. Avisamos o DRF para mandar este Token no Header em TODAS as requisições
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        self.especie = Especie.objects.create(nome="Cachorro")
        self.raca = Raca.objects.create(nome="Vira-lata", especie=self.especie)
        self.payload = {
            "nome": "Rex",
            "sexo": "M",
            "porte": "M",
            "data_resgate": "2024-01-15",
            "castrado": False,
            "historia": "Animal resgatado da rua",
            "especie": self.especie.id,
            "raca": self.raca.id,
        }

    def _criar_animal_db(self, **kwargs):
        dados = dict(
            nome="Rex",
            sexo="M",
            porte="M",
            data_resgate="2024-01-15",
            castrado=False,
            historia="Animal resgatado da rua",
            foto="",
            especie=self.especie,
            raca=self.raca,
        )
        dados.update(kwargs)
        return Animal.objects.create(**dados)

    # TDD01 — POST VÁLIDO

    def test_tdd01_post_valido(self):
        # TDD01: POST com payload válido retorna 201 e persiste no banco.
        resposta = self.client.post('/api/animais/', self.payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Animal.objects.count(), 1)

    # TDD02 — SEM NOME

    def test_tdd02_sem_nome(self):
        # TDD02: POST sem nome retorna 400.
        payload = {**self.payload}
        del payload['nome']
        resposta = self.client.post('/api/animais/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nome', resposta.data)

    # TDD03 — SEM ESPECIE

    def test_tdd03_sem_especie(self):
        # TDD03: POST sem especie retorna 400.
        payload = {**self.payload}
        del payload['especie']
        resposta = self.client.post('/api/animais/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('especie', resposta.data)

    # TDD04 — SEM RACA

    def test_tdd04_sem_raca(self):
        # TDD04: POST sem raca retorna 400.
        payload = {**self.payload}
        del payload['raca']
        resposta = self.client.post('/api/animais/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('raca', resposta.data)

    # TDD05 — SEM SEXO

    def test_tdd05_sem_sexo(self):
        # TDD05: POST sem sexo retorna 400.
        payload = {**self.payload}
        del payload['sexo']
        resposta = self.client.post('/api/animais/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('sexo', resposta.data)

    # TDD06 — SEM PORTE

    def test_tdd06_sem_porte(self):
        # TDD06: POST sem porte retorna 400.
        payload = {**self.payload}
        del payload['porte']
        resposta = self.client.post('/api/animais/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('porte', resposta.data)

    # TDD07 — SEM DATA_RESGATE

    def test_tdd07_sem_data_resgate(self):
        # TDD07: POST sem data_resgate retorna 400.
        payload = {**self.payload}
        del payload['data_resgate']
        resposta = self.client.post('/api/animais/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('data_resgate', resposta.data)

    # TDD08 — UPLOAD DE FOTO

    def test_tdd08_upload_foto(self):
        # TDD08: POST com foto salva arquivo e retorna caminho no banco.
        dados = {**self.payload, "foto": _foto()}
        resposta = self.client.post('/api/animais/', dados, format='multipart')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        animal = Animal.objects.get(pk=resposta.data['id'])
        self.assertTrue(bool(animal.foto))
        self.assertIsNotNone(resposta.data['foto'])

    # TDD09 — PUT EDITANDO NOME

    def test_tdd09_put_editar_nome(self):
        # TDD09: PUT com nome diferente retorna 200 e altera no banco.
        animal = self._criar_animal_db()
        dados = {**self.payload, "nome": "Rex Editado", "foto": _foto()}
        resposta = self.client.put(f'/api/animais/{animal.id}/', dados, format='multipart')
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        animal.refresh_from_db()
        self.assertEqual(animal.nome, "Rex Editado")

    # TDD10 — DELETE → EXCLUSÃO LÓGICA

    def test_tdd10_delete_exclusao_logica(self):
        # TDD10: DELETE seta ativo=False, registro permanece no banco.
        animal = self._criar_animal_db()
        resposta = self.client.delete(f'/api/animais/{animal.id}/')
        self.assertEqual(resposta.status_code, status.HTTP_204_NO_CONTENT)
        animal.refresh_from_db()
        self.assertFalse(animal.ativo)
        self.assertEqual(Animal.objects.count(), 1)

    # TDD11 — PATCH STATUS

    def test_tdd11_patch_status(self):
        # TDD11: PATCH altera status do animal entre os valores válidos.
        animal = self._criar_animal_db()
        resposta = self.client.patch(
            f'/api/animais/{animal.id}/', {"status": "Adotado"}, format='json'
        )
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        animal.refresh_from_db()
        self.assertEqual(animal.status, "Adotado")

        self.client.patch(f'/api/animais/{animal.id}/', {"status": "Disponivel"}, format='json')
        animal.refresh_from_db()
        self.assertEqual(animal.status, "Disponivel")

    # TDD12 — VÍNCULO COM ESPECIE, RACA E DEFICIENCIAS (VIA API)

    def test_tdd12_animal_com_especie_raca_deficiencias(self):
        # TDD12: Animal vincula Especie/Raca via FK e Deficiencia via M2M.
        def1 = Deficiencia.objects.create(nome="Visual")
        animal = self._criar_animal_db()
        animal.deficiencias.set([def1])
        animal.refresh_from_db()
        self.assertEqual(animal.especie, self.especie)
        self.assertEqual(animal.raca, self.raca)
        self.assertIn(def1, animal.deficiencias.all())

    # TDD13 — PERSISTÊNCIA COMPLETA

    def test_tdd13_persistencia_completa(self):
        # TDD13: Todos os campos enviados batem com o que está no banco.
        # Nota: em multipart, booleanos ausentes viram False (comportamento de checkbox do DRF).
        dados = {**self.payload, "foto": _foto(), "ativo": True, "castrado": False}
        resposta = self.client.post('/api/animais/', dados, format='multipart')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        animal = Animal.objects.get(pk=resposta.data['id'])
        self.assertEqual(animal.nome, "Rex")
        self.assertEqual(animal.sexo, "M")
        self.assertEqual(animal.porte, "M")
        self.assertEqual(str(animal.data_resgate), "2024-01-15")
        self.assertFalse(animal.castrado)
        self.assertEqual(animal.historia, "Animal resgatado da rua")
        self.assertEqual(animal.especie, self.especie)
        self.assertEqual(animal.raca, self.raca)
        self.assertTrue(animal.ativo)
        self.assertEqual(animal.status, "Disponivel")
