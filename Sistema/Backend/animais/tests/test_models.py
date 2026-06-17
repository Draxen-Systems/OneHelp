from django.test import TestCase
from animais.models import Especie, Raca, Animal
from core.models import Deficiencia


# TESTES DE MODELO (BANCO DE DADOS DIRETO)

class AnimalModelTestCase(TestCase):

    def setUp(self):
        self.especie = Especie.objects.create(nome="Cachorro")
        self.raca = Raca.objects.create(nome="Vira-lata", especie=self.especie)
        self.animal = Animal.objects.create(
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

    # TDD10 — EXCLUSÃO LÓGICA (MODELO)

    def test_tdd10_exclusao_logica_nivel_model(self):
        # TDD10: Inativar animal muda ativo para False, registro permanece no banco.
        self.animal.ativo = False
        self.animal.save()
        animal_no_banco = Animal.objects.get(pk=self.animal.pk)
        self.assertFalse(animal_no_banco.ativo)
        self.assertEqual(Animal.objects.count(), 1)

    # TDD12 — VÍNCULO COM ESPECIE, RACA E DEFICIENCIAS (MODELO)

    def test_tdd12_animal_vinculado_a_especie(self):
        # TDD12: Animal possui ForeignKey para Especie.
        self.assertEqual(self.animal.especie.nome, "Cachorro")

    def test_tdd12_animal_vinculado_a_raca(self):
        # TDD12: Animal possui ForeignKey para Raca.
        self.assertEqual(self.animal.raca.nome, "Vira-lata")

    def test_tdd12_animal_vinculado_a_deficiencias(self):
        # TDD12: Animal possui ManyToMany para Deficiencia via core.models.
        def1 = Deficiencia.objects.create(nome="Visual")
        def2 = Deficiencia.objects.create(nome="Auditiva")
        self.animal.deficiencias.set([def1, def2])
        self.assertEqual(self.animal.deficiencias.count(), 2)
        nomes = list(self.animal.deficiencias.values_list("nome", flat=True))
        self.assertIn("Visual", nomes)
        self.assertIn("Auditiva", nomes)
