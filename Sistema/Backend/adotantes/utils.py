import re


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
