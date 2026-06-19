from rest_framework.test import APITestCase
from rest_framework import status
from adotantes.models import Adotante, Endereco
from rest_framework_simplejwt.tokens import RefreshToken
from voluntarios.models import Voluntario 

# TESTES DE API

class AdotanteAPITestCase(APITestCase):
    # Testes de rotas da API.

    def setUp(self):
        self.voluntario = Voluntario.objects.create(
            nome="Admin", cpf="000.000.000-00", email="admin@test.com",
            login="admin", senha_hash="123", nivel_acesso="ADMINISTRADOR"
        )
        refresh = RefreshToken()
        refresh['voluntario_id'] = self.voluntario.id
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        self.payload = {
            "nome": "João Silva",
            "cpf": "52998224725",
            "telefone": "11999998888",
            "email": "joao@email.com",
            "nascimento": "2000-01-15",
            "pessoas": 3,
            "tipo_residencia": "C",
            "endereco": {
                "rua": "Rua Teste",
                "bairro": "Centro",
                "uf": "SP",
                "cep": "01001000",
                "numero": "123"
            },
            "deficiencias": []
        }

    # RN01 — CAMPOS OBRIGATÓRIOS

    def test_rn01_payload_vazio(self):
        # RN01: Rejeitar payload vazio.
        resposta = self.client.post('/api/adotantes/', {}, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rn01_sem_nome(self):
        # RN01 (TDD02): Rejeitar sem nome.
        payload = self.payload.copy()
        del payload['nome']

        resposta = self.client.post('/api/adotantes/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nome', resposta.data)

    def test_rn01_sem_cpf(self):
        # RN01 (TDD03): Rejeitar sem CPF.
        payload = self.payload.copy()
        del payload['cpf']

        resposta = self.client.post('/api/adotantes/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cpf', resposta.data)

    def test_rn01_sem_telefone(self):
        # RN01 (TDD04): Rejeitar sem telefone.
        payload = self.payload.copy()
        del payload['telefone']

        resposta = self.client.post('/api/adotantes/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('telefone', resposta.data)

    def test_rn01_sem_endereco(self):
        # RN01 (TDD05): Rejeitar sem endereco.
        payload = self.payload.copy()
        del payload['endereco']

        resposta = self.client.post('/api/adotantes/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('endereco', resposta.data)

    def test_rn01_sem_cep(self):
        # RN01 (TDD06): Rejeitar sem CEP.
        payload = self.payload.copy()
        payload['endereco'] = {**self.payload['endereco']}
        del payload['endereco']['cep']

        resposta = self.client.post('/api/adotantes/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cep', resposta.data['endereco'])

    # RN02 — CPF VÁLIDO

    def test_rn02_cpf_invalido(self):
        # RN02: Rejeitar CPF invalido.
        payload = self.payload.copy()
        payload['cpf'] = '11111111111'

        resposta = self.client.post('/api/adotantes/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cpf', resposta.data)

    # RN03 — CPF ÚNICO (VIA API)

    def test_rn03_cpf_duplicado_via_api(self):
        # RN03 (TDD08): Rejeitar CPF duplicado.
        self.client.post('/api/adotantes/', self.payload, format='json')

        payload2 = self.payload.copy()
        payload2['nome'] = "Outro Nome"
        payload2['email'] = "outro@email.com"
        payload2['endereco'] = {**self.payload['endereco']}

        resposta = self.client.post('/api/adotantes/', payload2, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cpf', resposta.data)

    # RN04 — MÁSCARA DE CPF

    def test_rn04_cpf_mascara_saida(self):
        # RN04: CPF formatado com mascara na saida.
        self.client.post('/api/adotantes/', self.payload, format='json')

        resposta = self.client.get('/api/adotantes/')
        self.assertEqual(resposta.data[0]['cpf'], "529.982.247-25")

    def test_rn04_cpf_mascara_entrada(self):
        # RN04 (TDD09): Aceitar CPF com mascara na entrada.
        payload = self.payload.copy()
        payload['cpf'] = "529.982.247-25"

        resposta = self.client.post('/api/adotantes/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)

        adotante = Adotante.objects.get(pk=resposta.data['id'])
        self.assertEqual(adotante.cpf, "52998224725")
        self.assertEqual(resposta.data['cpf'], "529.982.247-25")

    # RN05 — MÁSCARA DE CEP

    def test_rn05_cep_mascara_saida(self):
        # RN05: CEP formatado com mascara na saida.
        self.client.post('/api/adotantes/', self.payload, format='json')

        resposta = self.client.get('/api/adotantes/')
        self.assertEqual(resposta.data[0]['endereco']['cep'], "01001-000")

    def test_rn05_cep_mascara_entrada(self):
        # RN05 (TDD10): Aceitar CEP com mascara na entrada.
        payload = self.payload.copy()
        payload['endereco'] = {**self.payload['endereco'], 'cep': '01001-000'}

        resposta = self.client.post('/api/adotantes/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)

        adotante = Adotante.objects.get(pk=resposta.data['id'])
        self.assertEqual(adotante.endereco.cep, "01001000")
        self.assertEqual(resposta.data['endereco']['cep'], "01001-000")

    # RN08 — UPLOAD DE FOTO

    def test_rn08_upload_foto(self):
        # RN08 (TDD14): Salvar e retornar upload de foto.
        from django.core.files.uploadedfile import SimpleUploadedFile

        gif_valido = (
            b'GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff'
            b'!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01'
            b'\x00\x00\x02\x02D\x01\x00;'
        )
        imagem = SimpleUploadedFile(
            "teste.gif", gif_valido, content_type="image/gif"
        )

        endereco = self.payload['endereco']
        dados_multipart = {
            "nome": self.payload['nome'],
            "cpf": self.payload['cpf'],
            "telefone": self.payload['telefone'],
            "email": self.payload['email'],
            "nascimento": self.payload['nascimento'],
            "pessoas": self.payload['pessoas'],
            "tipo_residencia": self.payload['tipo_residencia'],
            "endereco.rua": endereco['rua'],
            "endereco.bairro": endereco['bairro'],
            "endereco.uf": endereco['uf'],
            "endereco.cep": endereco['cep'],
            "endereco.numero": endereco['numero'],
            "foto": imagem,
        }

        resposta = self.client.post('/api/adotantes/', dados_multipart, format='multipart')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)

        adotante = Adotante.objects.get(pk=resposta.data['id'])
        self.assertTrue(bool(adotante.foto))
        self.assertIsNotNone(resposta.data['foto'])

    # RN09 — OBSERVAÇÕES OPCIONAIS

    def test_rn09_observacoes_opcional(self):
        # RN09 (TDD15): Cadastro sem observacoes e aceito.
        payload = self.payload.copy()
        payload.pop('observacoes', None)

        resposta = self.client.post('/api/adotantes/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)

    # RN10 — EXCLUSÃO LÓGICA (VIA API)

    def test_rn10_exclusao_logica_via_api(self):
        # RN10: Rota DELETE altera status para INATIVO.
        resposta_criar = self.client.post('/api/adotantes/', self.payload, format='json')
        adotante_id = resposta_criar.data['id']

        self.client.delete(f'/api/adotantes/{adotante_id}/')

        adotante = Adotante.objects.get(pk=adotante_id)
        self.assertEqual(adotante.status, 'INATIVO')

    # RN11 — ALTERAÇÃO DE STATUS

    def test_rn11_alteracao_status(self):
        # RN11 (TDD18): Rota PATCH permite alternar status.
        resposta_criar = self.client.post('/api/adotantes/', self.payload, format='json')
        adotante_id = resposta_criar.data['id']

        resposta = self.client.patch(
            f'/api/adotantes/{adotante_id}/', {"status": "INATIVO"}, format='json'
        )
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)

        adotante = Adotante.objects.get(pk=adotante_id)
        self.assertEqual(adotante.status, "INATIVO")

        self.client.patch(f'/api/adotantes/{adotante_id}/', {"status": "ATIVO"}, format='json')
        adotante.refresh_from_db()
        self.assertEqual(adotante.status, "ATIVO")

    # RN12 — TRATAMENTO DE ERROS / E-MAIL DUPLICADO

    def test_rn12_email_duplicado(self):
        # RN12 (TDD23): Rejeitar email ja cadastrado.
        self.client.post('/api/adotantes/', self.payload, format='json')

        payload2 = self.payload.copy()
        payload2['cpf'] = "111.444.777-35"
        payload2['nome'] = "Outro Nome"
        payload2['endereco'] = {**self.payload['endereco']}

        resposta = self.client.post('/api/adotantes/', payload2, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', resposta.data)

    # RN13 — PERSISTÊNCIA DOS DADOS

    def test_rn13_persistencia_completa(self):
        # RN13 (TDD19): Todos os campos sao gravados e recuperados.
        resposta = self.client.post('/api/adotantes/', self.payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)

        adotante = Adotante.objects.get(pk=resposta.data['id'])

        self.assertEqual(adotante.nome, self.payload['nome'])
        self.assertEqual(adotante.telefone, self.payload['telefone'])
        self.assertEqual(adotante.email, self.payload['email'])
        self.assertEqual(str(adotante.nascimento), "2000-01-15")
        self.assertEqual(adotante.pessoas, self.payload['pessoas'])
        self.assertEqual(adotante.tipo_residencia, self.payload['tipo_residencia'])
        self.assertEqual(adotante.endereco.rua, self.payload['endereco']['rua'])
        self.assertEqual(adotante.endereco.bairro, self.payload['endereco']['bairro'])
        self.assertEqual(adotante.endereco.uf, self.payload['endereco']['uf'])
        self.assertEqual(adotante.endereco.numero, self.payload['endereco']['numero'])

    def test_rn13_persistencia_deficiencias(self):
        # RN13: Cadastro e persistencia de deficiencias.
        payload = self.payload.copy()
        payload['deficiencias'] = ['Deficiência Visual', 'Deficiência Física']

        resposta = self.client.post('/api/adotantes/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        
        adotante = Adotante.objects.get(pk=resposta.data['id'])
        self.assertEqual(adotante.deficiencias.count(), 2)
        
        nomes = [d.nome for d in adotante.deficiencias.all()]
        self.assertIn('Deficiência Visual', nomes)
        self.assertIn('Deficiência Física', nomes)
        
        self.assertEqual(set(resposta.data['deficiencias']), {'Deficiência Visual', 'Deficiência Física'})

    def test_rn13_persistencia_data_nascimento_formato_br(self):
        # RN13: Cadastro com data no formato brasileiro.
        payload = self.payload.copy()
        payload['nascimento'] = '15/01/2000'

        resposta = self.client.post('/api/adotantes/', payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        
        adotante = Adotante.objects.get(pk=resposta.data['id'])
        self.assertEqual(str(adotante.nascimento), '2000-01-15')

    # CRUD BÁSICO
    
    def test_crud_criar_adotante(self):
        # CRUD: Criar adotante.
        resposta = self.client.post('/api/adotantes/', self.payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Adotante.objects.count(), 1)
        self.assertEqual(Adotante.objects.first().nome, "João Silva")

    def test_crud_listar_adotantes(self):
        # CRUD: Listar adotantes.
        self.client.post('/api/adotantes/', self.payload, format='json')

        resposta = self.client.get('/api/adotantes/')
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resposta.data), 1)

    def test_crud_editar_adotante(self):
        # CRUD: Editar adotante.
        resposta_criar = self.client.post('/api/adotantes/', self.payload, format='json')
        adotante_id = resposta_criar.data['id']

        payload_edicao = self.payload.copy()
        payload_edicao['nome'] = "João Editado"
        
        resposta_editar = self.client.put(
            f'/api/adotantes/{adotante_id}/', payload_edicao, format='json'
        )
        self.assertEqual(resposta_editar.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta_editar.data['nome'], "João Editado")
