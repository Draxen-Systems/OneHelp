import re
from datetime import datetime
from rest_framework import serializers
from .models import Adotante, Endereco
from core.models import Deficiencia


def apenas_numeros(valor):
    # Remove caracteres não numéricos.
    return re.sub(r"\D", "", str(valor))


def verificar_calculo_cpf(cpf: str) -> bool:
    # RN02 - Validação matemática do CPF.
    cpf = apenas_numeros(cpf)

    if len(cpf) != 11 or cpf == cpf[0] * 11:
        return False

    for posicao in range(9, 11):
        soma = sum(int(cpf[i]) * (posicao + 1 - i) for i in range(posicao))
        resto = (soma * 10) % 11

        if (0 if resto == 10 else resto) != int(cpf[posicao]):
            return False

    return True


class EnderecoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Endereco
        fields = "__all__"

    def to_internal_value(self, data):
        # RN05 - Remove máscara do CEP antes da validação.
        if hasattr(data, "dict"):
            data = data.dict()
        else:
            data = dict(data)

        if data.get("cep"):
            data["cep"] = apenas_numeros(data["cep"])

        return super().to_internal_value(data)

    def to_representation(self, instance):
        # RN05 - Aplica máscara de CEP na resposta da API.
        dados = super().to_representation(instance)

        cep = dados.get("cep", "")
        if cep and len(cep) == 8:
            dados["cep"] = f"{cep[:5]}-{cep[5:]}"

        return dados


class AdotanteSerializer(serializers.ModelSerializer):
    endereco = EnderecoSerializer()

    deficiencias = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False,
        allow_null=True,
        default=[],
    )

    class Meta:
        model = Adotante
        fields = "__all__"

        extra_kwargs = {"cpf": {"validators": []}, "email": {"validators": []}}

    def to_internal_value(self, data):
        # Normaliza CPF, endereço, data e arquivos recebidos pela API.
        deficiencias_lista = None

        if hasattr(data, "getlist"):
            deficiencias_lista = data.getlist("deficiencias")

            if not deficiencias_lista:
                deficiencias_lista = data.getlist("deficiencias[]")

        arquivo_foto = None
        if hasattr(data, "dict"):
            arquivo_foto = data.get("foto") if hasattr(data.get("foto", None), "read") else None
            data = data.dict()
        else:
            data = dict(data)

        if arquivo_foto is not None:
            data["foto"] = arquivo_foto

        if deficiencias_lista is not None:
            data["deficiencias"] = deficiencias_lista

        if "endereco.rua" in data or "endereco.cep" in data:
            data["endereco"] = {
                "rua": data.pop("endereco.rua", ""),
                "bairro": data.pop("endereco.bairro", ""),
                "uf": data.pop("endereco.uf", ""),
                "cep": data.pop("endereco.cep", ""),
                "numero": data.pop("endereco.numero", ""),
            }

        # RN04 - Remove máscara do CPF antes da validação.
        if data.get("cpf"):
            data["cpf"] = apenas_numeros(data["cpf"])

        if "foto" in data and not data["foto"]:
            data.pop("foto")

        if data.get("nascimento"):
            nascimento = str(data["nascimento"])

            try:
                data_formatada = datetime.strptime(nascimento, "%d/%m/%Y").date()

                data["nascimento"] = data_formatada.isoformat()

            except ValueError:
                pass

        return super().to_internal_value(data)

    def validate_cpf(self, value):
        # RN02 - Valida CPF.
        # RN03 - Garante unicidade do CPF.
        if not verificar_calculo_cpf(value):
            raise serializers.ValidationError("O CPF informado é inválido.")

        cpfs_existentes = Adotante.objects.filter(cpf=value)

        if self.instance:
            cpfs_existentes = cpfs_existentes.exclude(pk=self.instance.pk)

        if cpfs_existentes.exists():
            raise serializers.ValidationError(
                "Já existe um adotante cadastrado com este CPF."
            )

        return value

    def validate_email(self, value):
        # RN12 - Retorna mensagem amigável para e-mail duplicado tanto na criação quanto na atualização.
        emails_existentes = Adotante.objects.filter(email=value)

        if self.instance:
            emails_existentes = emails_existentes.exclude(pk=self.instance.pk)

        if emails_existentes.exists():
            raise serializers.ValidationError(
                "Já existe um adotante cadastrado com este e-mail."
            )

        return value

    def to_representation(self, instance):
        # RN04 - Aplica máscara de CPF na resposta da API.
        dados = super().to_representation(instance)

        cpf = dados.get("cpf", "")

        if cpf and len(cpf) == 11:
            dados["cpf"] = f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"

        dados["deficiencias"] = [d.nome for d in instance.deficiencias.all()]

        return dados

    def create(self, validated_data):
        # RN13 - Persiste adotante, endereço e deficiências.
        dados_endereco = validated_data.pop("endereco")

        deficiencias_data = validated_data.pop("deficiencias", [])

        endereco = Endereco.objects.create(**dados_endereco)

        adotante = Adotante.objects.create(endereco=endereco, **validated_data)

        deficiencias_objs = []

        for nome_def in deficiencias_data:
            if nome_def.strip():
                obj, _ = Deficiencia.objects.get_or_create(nome=nome_def.strip())

                deficiencias_objs.append(obj)

        adotante.deficiencias.set(deficiencias_objs)

        return adotante

    def update(self, instance, validated_data):
        # RN13 - Atualiza adotante, endereço e deficiências.
        dados_endereco = validated_data.pop("endereco", None)

        if dados_endereco:
            for campo, valor in dados_endereco.items():
                setattr(instance.endereco, campo, valor)

            instance.endereco.save()

        if "deficiencias" in validated_data:
            deficiencias_data = validated_data.pop("deficiencias")

            deficiencias_objs = []

            for nome_def in deficiencias_data:
                if nome_def.strip():
                    obj, _ = Deficiencia.objects.get_or_create(nome=nome_def.strip())

                    deficiencias_objs.append(obj)

            instance.deficiencias.set(deficiencias_objs)

        for campo, valor in validated_data.items():
            setattr(instance, campo, valor)

        instance.save()

        return instance
