from django.test import TestCase
from .models import Funcionario

# Create your tests here.
class FuncionarioTestCase(TestCase):
    def setUp(self):
        # Criamos um funcionário para testar as restrições
        Funcionario.objects.create(
            nome="Teste Inicial",
            cpf="11122233344",
            email="teste@ong.com",
            login="teste.admin",
            status="ATIVO"
        )

    def test_rn01_cpf_unico(self):
        """Valida se o sistema impede CPFs duplicados (RN01)"""
        with self.assertRaises(Exception):
            Funcionario.objects.create(
                nome="Outro Nome",
                cpf="11122233344", # CPF duplicado
                email="outro@ong.com"
            )

    def test_rn09_exclusao_logica(self):
        """Valida se o delete() apenas inativa o registro (RN09)"""
        func = Funcionario.objects.get(cpf="11122233344")
        func.delete() # Chama o nosso método customizado
        
        # O registro ainda deve existir no banco, mas como INATIVO
        self.assertEqual(func.status, 'INATIVO')