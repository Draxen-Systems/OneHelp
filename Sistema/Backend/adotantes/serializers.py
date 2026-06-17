from datetime import datetime
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Adotante, Endereco
from core.models import Deficiencia
from .utils import apenas_numeros, verificar_calculo_cpf


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

        extra_kwargs = {
            "cpf": {"validators": []},
            "email": {
                # RN12 - Retorna mensagem amigável para e-mail duplicado tanto na criação quanto na atualização.
                "validators": [
                    UniqueValidator(
                        queryset=Adotante.objects.all(),
                        message="Já existe um adotante cadastrado com este e-mail.",
                    )
                ]
            },
        }

    def to_internal_value(self, data):
        # Normaliza CPF, endereço, data e arquivos recebidos pela API.
        data = self._extrair_deficiencias(data)
        data = self._extrair_foto(data)
        data = self._achatar_endereco(data)
        data = self._limpar_cpf(data)
        data = self._remover_foto_vazia(data)
        data = self._converter_nascimento(data)
        return super().to_internal_value(data)

    def _extrair_deficiencias(self, data):
        deficiencias_lista = None

        if hasattr(data, "getlist"):
            deficiencias_lista = data.getlist("deficiencias")

            if not deficiencias_lista:
                deficiencias_lista = data.getlist("deficiencias[]")

        self._deficiencias_lista = deficiencias_lista

        return data

    def _extrair_foto(self, data):
        arquivo_foto = None
        if hasattr(data, "dict"):
            arquivo_foto = (
                data.get("foto") if hasattr(data.get("foto", None), "read") else None
            )
            data = data.dict()
        else:
            data = dict(data)

        if arquivo_foto is not None:
            data["foto"] = arquivo_foto

        if self._deficiencias_lista is not None:
            data["deficiencias"] = self._deficiencias_lista

        return data

    def _achatar_endereco(self, data):
        if "endereco.rua" in data or "endereco.cep" in data:
            data["endereco"] = {
                "rua": data.pop("endereco.rua", ""),
                "bairro": data.pop("endereco.bairro", ""),
                "uf": data.pop("endereco.uf", ""),
                "cep": data.pop("endereco.cep", ""),
                "numero": data.pop("endereco.numero", ""),
            }

        return data

    def _limpar_cpf(self, data):
        # RN04 - Remove máscara do CPF antes da validação.
        if data.get("cpf"):
            data["cpf"] = apenas_numeros(data["cpf"])

        return data

    def _remover_foto_vazia(self, data):
        if "foto" in data and not data["foto"]:
            data.pop("foto")

        return data

    def _converter_nascimento(self, data):
        if data.get("nascimento"):
            nascimento = str(data["nascimento"])

            try:
                data_formatada = datetime.strptime(nascimento, "%d/%m/%Y").date()

                data["nascimento"] = data_formatada.isoformat()

            except ValueError:
                pass

        return data

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
