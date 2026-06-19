import json
import random
from datetime import timedelta
from faker import Faker

# Inicializa o Faker configurado para o Brasil
fake = Faker('pt_BR')

# Listas de dados para gerar variedade coerente
ESPECIES = ['Cachorro', 'Gato']
PORTES = ['Pequeno', 'Medio', 'Grande']
SEXOS = ['M', 'F']
CONDICOES_CHEGADA = ['Desnutrição severa', 'Atropelamento', 'Abandono', 'Maus tratos', 'Doença de pele', 'Filhote órfão']
DEFICIENCIAS = ['Cegueira parcial', 'Amputação de membro', 'Surdez', 'Paralisia traseira']
PROCEDIMENTOS = ['Vermifugação e Vacina V10', 'Castração', 'Cirurgia Ortopédica', 'Tratamento de Sarna', 'Internação', 'Raio-X']
STATUS = ['DISPONIVEL', 'ADOTADO', 'TRATAMENTO', 'OBITO']
MOTIVOS_DEVOLUCAO = ['Incompatibilidade com outros animais', 'Alergia na família', 'Falta de espaço', 'Problemas comportamentais', 'Mudança de casa']
TIPOS_MORADIA = ['Apartamento', 'Casa com quintal', 'Casa sem quintal', 'Chácara']

# Configurações de volume
NUMERO_REGISTROS = 10000
dados_finais = []

print(f"Gerando {NUMERO_REGISTROS} registros de resgates. Aguarde...")

for i in range(NUMERO_REGISTROS):
    # Gerando dados base temporais
    data_resgate = fake.date_time_between(start_date='-2y', end_date='now')
    
    # Sorteando Status
    status_sorteado = random.choices(STATUS, weights=[30, 50, 15, 5], k=1)[0]
    
    # 1. Objeto Animal
    animal = {
        "nome": fake.first_name() if random.random() > 0.1 else "Sem Nome", # 10% chance de não ter nome
        "especie": random.choice(ESPECIES),
        "sexo": random.choice(SEXOS),
        "porte": random.choice(PORTES),
        "idade_estimada_anos": random.randint(0, 15),
        # 15% de chance de ter 1 ou 2 deficiências
        "deficiencias": random.sample(DEFICIENCIAS, k=random.randint(1, 2)) if random.random() < 0.15 else []
    }

    # 2. Objeto ONG Responsável
    ong = {
        "codigo_ong": f"ONG-{fake.state_abbr()}-{random.randint(1, 50):03d}",
        "nome_fantasia": fake.company() + " Proteção Animal"
    }

    # 3. Objeto Resgate
    resgate = {
        "data_resgate": {"$date": data_resgate.isoformat() + "Z"}, # Formato MongoDB ISODate
        "endereco": {
            "estado": fake.state_abbr(),
            "cidade": fake.city(),
            "zona": random.choice(["Norte", "Sul", "Leste", "Oeste", "Centro"])
        },
        "condicao_chegada": random.choice(CONDICOES_CHEGADA)
    }

    # 4. Objeto Histórico Médico (Gera de 1 a 4 procedimentos)
    historico_medico = []
    for _ in range(random.randint(1, 4)):
        data_atendimento = data_resgate + timedelta(days=random.randint(1, 30))
        historico_medico.append({
            "data_atendimento": {"$date": data_atendimento.isoformat() + "Z"},
            "procedimento": random.choice(PROCEDIMENTOS),
            "custo_estimado": round(random.uniform(50.0, 1500.0), 2)
        })

    # Construindo o documento base
    documento = {
        "animal": animal,
        "ong_responsavel": ong,
        "resgate": resgate,
        "historico_medico": historico_medico,
        "status_atual": status_sorteado
    }

    # 5. Objeto Histórico de Adoções (Apenas se já foi adotado alguma vez)
    # Se está DISPONÍVEL, pode já ter sido devolvido no passado.
    # Se está ADOTADO, tem pelo menos uma adoção vigente.
    historico_adocoes = []
    
    # 20% de chance de um animal disponível já ter sofrido uma devolução
    teve_devolucao_passada = (status_sorteado == 'DISPONIVEL' and random.random() < 0.20)
    
    if status_sorteado == 'ADOTADO' or teve_devolucao_passada:
        
        # Gerar a adoção "Devolvida"
        if teve_devolucao_passada or (status_sorteado == 'ADOTADO' and random.random() < 0.10): 
            data_adocao = data_resgate + timedelta(days=random.randint(30, 90))
            data_devolucao = data_adocao + timedelta(days=random.randint(5, 60))
            
            historico_adocoes.append({
                "data_adocao": {"$date": data_adocao.isoformat() + "Z"},
                "tempo_espera_dias": (data_adocao - data_resgate).days,
                "perfil_adotante": {
                    "faixa_etaria": random.choice(["18-25", "26-35", "36-50", "50+"]),
                    "tipo_moradia": random.choice(TIPOS_MORADIA),
                    "possui_outros_animais": random.choice([True, False])
                },
                "status_adocao": "DEVOLVIDO",
                "data_devolucao": {"$date": data_devolucao.isoformat() + "Z"},
                "motivo_devolucao": random.choice(MOTIVOS_DEVOLUCAO)
            })

        # Se for realmente ADOTADO, gera a adoção final VIGENTE
        if status_sorteado == 'ADOTADO':
            data_adocao_final = data_resgate + timedelta(days=random.randint(40, 120))
            historico_adocoes.append({
                "data_adocao": {"$date": data_adocao_final.isoformat() + "Z"},
                "tempo_espera_dias": (data_adocao_final - data_resgate).days,
                "perfil_adotante": {
                    "faixa_etaria": random.choice(["18-25", "26-35", "36-50", "50+"]),
                    "tipo_moradia": random.choice(TIPOS_MORADIA),
                    "possui_outros_animais": random.choice([True, False])
                },
                "status_adocao": "VIGENTE"
            })
            
    # Só anexa a chave de histórico de adoções se ela não for vazia
    if historico_adocoes:
        documento["historico_adocoes"] = historico_adocoes

    dados_finais.append(documento)

# Escreve o JSON em um arquivo
with open('massa_dados_resgates.json', 'w', encoding='utf-8') as f:
    json.dump(dados_finais, f, ensure_ascii=False, indent=2)

print("Arquivo 'massa_dados_resgates.json' gerado com sucesso!")
print("Instrução para importação: mongoimport --db ong_nacional --collection registro_resgates --file massa_dados_resgates.json --jsonArray")