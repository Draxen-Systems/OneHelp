from django.test import TestCase
from adotantes.models import Adotante, Endereco


# TESTES DE MODELO (BANCO DE DADOS DIRETO)

class AdotanteModelTestCase(TestCase):

    def setUp(self):
        self.endereco = Endereco.objects.create(
            rua="Rua Teste",
            bairro="Centro",
            uf="SP",
            cep="01001000",
            numero="123"
        )
        self.adotante = Adotante.objects.create(
            nome="Maria Silva",
            cpf="52998224725",
            telefone="11999998888",
            email="maria@email.com",
            nascimento="2000-01-15",
            pessoas=3,
            tipo_residencia="C",
            endereco=self.endereco
        )

    # RN03 — CPF ÚNICO (MODELO)

    def test_rn03_cpf_unico_nivel_model(self):
        # RN03: Impedir CPFs duplicados no banco.
        endereco2 = Endereco.objects.create(
            rua="Outra Rua", bairro="Outro Bairro", uf="RJ", cep="20040020", numero="456"
        )
        with self.assertRaises(Exception):
            Adotante.objects.create(
                nome="Outro Nome",
                cpf="52998224725",
                telefone="11888887777",
                email="outro@email.com",
                nascimento="1995-05-20",
                pessoas=2,
                tipo_residencia="A",
                endereco=endereco2
            )

    # RN10 — EXCLUSÃO LÓGICA (MODELO)

    def test_rn10_exclusao_logica_nivel_model(self):
        # RN10: Exclusao logica altera status para INATIVO.
        self.adotante.delete()
        adotante_no_banco = Adotante.objects.get(pk=self.adotante.pk)
        self.assertEqual(adotante_no_banco.status, 'INATIVO')
