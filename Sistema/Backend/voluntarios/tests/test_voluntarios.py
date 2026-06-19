from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.hashers import check_password

# Adapte a importação de acordo com o nome do seu app (ex: usuarios, pessoas, voluntarios)
from voluntarios.models import Voluntario

class VoluntarioAPITestCase(APITestCase):

    def setUp(self):
        # Usando reverse para não "chumbar" a URL, blindando contra futuras mudanças de rota
        self.url_list = reverse('voluntario-list')
        
        self.payload_valido = {
            "nome": "João Voluntário",
            "cpf": "123.456.789-00",
            "email": "joao@ong.com",
            "funcao": "Resgatista",
            "login": "joao.resgate",
            "senha_hash": "senha_forte_123", # O DRF vai enviar em plain text, o model deve hashear
            "telefone": "(11) 99999-9999",
            "nivel_acesso": "VOLUNTARIO"
        }

    def _criar_voluntario_db(self, **kwargs):
        """Helper para criar registros rápidos no banco"""
        dados = dict(
            nome="Maria Admin",
            cpf="987.654.321-11",
            email="maria@ong.com",
            funcao="Coordenadora",
            login="maria.admin",
            senha_hash="senha_admin",
            nivel_acesso="ADMINISTRADOR"
        )
        dados.update(kwargs)
        return Voluntario.objects.create(**dados)

    # ==========================================
    # TDD01 — POST VÁLIDO E HASHING
    # ==========================================
    def test_tdd01_post_valido_e_hash_senha(self):
        # TDD01: Valida se cria com 201 e se a senha é criptografada no banco
        resposta = self.client.post(self.url_list, self.payload_valido, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Voluntario.objects.count(), 1)
        
        # Validação RN04: A senha não pode estar em texto puro
        voluntario_salvo = Voluntario.objects.get(login="joao.resgate")
        self.assertTrue(voluntario_salvo.senha_hash.startswith('pbkdf2_sha256$'))
        self.assertTrue(check_password("senha_forte_123", voluntario_salvo.senha_hash))

    # ==========================================
    # TDD02 — CAMPOS OBRIGATÓRIOS (BAD REQUEST)
    # ==========================================
    def test_tdd02_sem_nome_retorna_400(self):
        payload = {**self.payload_valido}
        del payload['nome']
        resposta = self.client.post(self.url_list, payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nome', resposta.data)

    def test_tdd03_sem_login_retorna_400(self):
        payload = {**self.payload_valido}
        del payload['login']
        resposta = self.client.post(self.url_list, payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('login', resposta.data)

    def test_tdd04_sem_senha_retorna_400(self):
        payload = {**self.payload_valido}
        del payload['senha_hash']
        resposta = self.client.post(self.url_list, payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('senha_hash', resposta.data)

    # ==========================================
    # TDD05 — REGRAS DE UNICIDADE (UNIQUE)
    # ==========================================
    def test_tdd05_unicidade_cpf_email_login(self):
        # TDD05: Cria um voluntário primeiro
        self._criar_voluntario_db(cpf="111.111.111-11", email="unico@ong.com", login="user.unico")
        
        # Tenta criar outro com o mesmo CPF
        payload_cpf = {**self.payload_valido, "cpf": "111.111.111-11"}
        resp_cpf = self.client.post(self.url_list, payload_cpf, format='json')
        self.assertEqual(resp_cpf.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cpf', resp_cpf.data)

        # Tenta criar outro com o mesmo E-mail
        payload_email = {**self.payload_valido, "email": "unico@ong.com"}
        resp_email = self.client.post(self.url_list, payload_email, format='json')
        self.assertEqual(resp_email.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', resp_email.data)
        
        # Tenta criar outro com o mesmo Login
        payload_login = {**self.payload_valido, "login": "user.unico"}
        resp_login = self.client.post(self.url_list, payload_login, format='json')
        self.assertEqual(resp_login.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('login', resp_login.data)

    # ==========================================
    # TDD06 — SOFT DELETE (RN09)
    # ==========================================
    def test_tdd06_delete_exclusao_logica_status(self):
        # TDD06: DELETE não apaga, altera o status para 'INATIVO'
        voluntario = self._criar_voluntario_db()
        url_detail = reverse('voluntario-detail', args=[voluntario.id])
        
        resposta = self.client.delete(url_detail)
        self.assertEqual(resposta.status_code, status.HTTP_204_NO_CONTENT)
        
        voluntario.refresh_from_db()
        self.assertEqual(voluntario.status, 'INATIVO') # RN09 Validada
        self.assertEqual(Voluntario.objects.count(), 1) # Garante que ainda existe

    # ==========================================
    # TDD07 — PATCH E EDIÇÃO
    # ==========================================
    def test_tdd07_patch_atualizar_telefone(self):
        # TDD07: Atualiza parcialmente um voluntário
        voluntario = self._criar_voluntario_db(telefone="000")
        url_detail = reverse('voluntario-detail', args=[voluntario.id])
        
        resposta = self.client.patch(url_detail, {"telefone": "999"}, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        
        voluntario.refresh_from_db()
        self.assertEqual(voluntario.telefone, "999")

    # ==========================================
    # TDD08 — SEGURANÇA WRITE_ONLY
    # ==========================================
    def test_tdd08_senha_nao_exposta_no_get(self):
        # TDD08: Garante que o GET da API não exibe a hash da senha (furo de segurança)
        voluntario = self._criar_voluntario_db()
        url_detail = reverse('voluntario-detail', args=[voluntario.id])
        
        resposta = self.client.get(url_detail)
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        # O campo 'senha_hash' deve ser ignorado no JSON de resposta devido ao 'write_only'
        self.assertNotIn('senha_hash', resposta.data)