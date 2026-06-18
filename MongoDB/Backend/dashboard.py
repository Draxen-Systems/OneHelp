import streamlit as st
import pandas as pd
import plotly.express as px
from pymongo import MongoClient

# ==========================================
# 1. CONFIGURAÇÃO DA PÁGINA
# ==========================================
st.set_page_config(page_title="Dashboard ONG Nacional", page_icon="🐾", layout="wide")

st.title("🐾 Centro de Comando Nacional de Resgates")
st.markdown("Monitorização Executiva de Big Data - Rede de 500 ONGs Parceiras")
st.divider()

# ==========================================
# 2. CONEXÃO COM O MONGODB
# ==========================================
@st.cache_resource
def get_database():
    client = MongoClient("mongodb://localhost:27017/")
    return client["ong_nacional"]["registro_resgates"]

colecao = get_database()

def executar_agregacao(pipeline):
    return list(colecao.aggregate(pipeline))

def df_seguro(dados):
    return pd.DataFrame(dados) if dados else pd.DataFrame()

# ==========================================
# 3. RENDERIZAÇÃO E CRUZAMENTO DAS 10 CONSULTAS
# ==========================================

# --- CONSULTA 8 DO WORD: Painel Executivo Central (Uso do $facet) ---
st.subheader("Visão Geral do Sistema")
pipeline_kpi = [
    { "$facet": {
        "resumo_status": [{ "$group": { "_id": "$status_atual", "total": { "$sum": 1 } } }],
        "custo_nacional_aberto": [
            { "$match": { "status_atual": { "$in": ["DISPONIVEL", "TRATAMENTO"] } } },
            { "$unwind": "$historico_medico" },
            { "$group": { "_id": None, "total_gasto": { "$sum": "$historico_medico.custo_estimado" } } }
        ],
        "top_especies": [
            { "$group": { "_id": "$animal.especie", "total": { "$sum": 1 } } },
            { "$sort": { "total": -1 } }
        ]
    }}
]
dados_kpi = executar_agregacao(pipeline_kpi)[0]

# Extração dos dados do Facet
total_animais = sum([item['total'] for item in dados_kpi.get('resumo_status', [])])
custos_abertos = dados_kpi.get('custo_nacional_aberto', [{'total_gasto': 0}])[0]['total_gasto']
adotados = next((item['total'] for item in dados_kpi.get('resumo_status', []) if item['_id'] == 'ADOTADO'), 0)
especie_lider = dados_kpi.get('top_especies', [{'_id': 'N/A'}])[0]['_id']

col1, col2, col3, col4, col5 = st.columns(5)
col1.metric("Total de Resgates", f"{total_animais:,}".replace(",", "."))
col2.metric("Animais Adotados", f"{adotados:,}".replace(",", "."))
col3.metric("Taxa de Saída Global", f"{(adotados/total_animais)*100:.1f}%" if total_animais else "0%")
col4.metric("Custos em Aberto", f"R$ {custos_abertos:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
col5.metric("Espécie Mais Resgatada", especie_lider)

st.divider()

# --- CONSULTA 5 DO WORD: Sazonalidade: O Mapa Temporal do Abandono ---
st.subheader("Sazonalidade: Tendência de Abandono Crítico")
pipeline_sazonalidade = [
    { "$match": { "resgate.condicao_chegada": { "$regex": "Desnutri", "$options": "i" } } },
    { "$group": {
        "_id": { "mes": { "$month": "$resgate.data_resgate" }, "ano": { "$year": "$resgate.data_resgate" } },
        "volume_resgates": { "$sum": 1 }
    }},
    { "$sort": { "_id.ano": 1, "_id.mes": 1 } }
]
df_sazonal = df_seguro(executar_agregacao(pipeline_sazonalidade))
if not df_sazonal.empty:
    df_sazonal['Período'] = df_sazonal['_id'].apply(lambda x: f"{x['ano']}-{x['mes']:02d}")
    fig_sazonal = px.line(df_sazonal, x='Período', y='volume_resgates', markers=True, title="Entradas por Desnutrição (Linha Temporal)", line_shape='spline')
    st.plotly_chart(fig_sazonal, use_container_width=True)

col_reg1, col_reg2 = st.columns(2)

# --- CONSULTA 1 DO WORD: Taxa de Retenção vs. Devolução por Estado ---
with col_reg1:
    pipeline_sucesso = [
        { "$unwind": "$historico_adocoes" },
        { "$group": {
            "_id": "$resgate.endereco.estado",
            "total_adocoes": { "$sum": 1 },
            "total_devolucoes": { "$sum": { "$cond": [{ "$eq": ["$historico_adocoes.status_adocao", "DEVOLVIDO"] }, 1, 0] } }
        }},
        { "$project": {
            "Estado": "$_id",
            "total_adocoes": 1,
            "total_devolucoes": 1,
            "Taxa de Sucesso (%)": { "$multiply": [ { "$divide": [ { "$subtract": ["$total_adocoes", "$total_devolucoes"] }, "$total_adocoes" ] }, 100 ] }
        }},
        { "$sort": { "Taxa de Sucesso (%)": 1 } } # Ordenado pelos piores primeiro (Conforme Word)
    ]
    df_sucesso = df_seguro(executar_agregacao(pipeline_sucesso))
    if not df_sucesso.empty:
        fig_sucesso = px.bar(df_sucesso, x="Estado", y="Taxa de Sucesso (%)", title="Retenção Líquida de Adoções por Estado", color="Taxa de Sucesso (%)", color_continuous_scale="RdYlGn")
        fig_sucesso.update_yaxes(range=[0, 100])
        st.plotly_chart(fig_sucesso, use_container_width=True)

# --- CONSULTA 2 DO WORD: Custo Médico Regionalizado ---
with col_reg2:
    pipeline_custo = [
        { "$unwind": "$historico_medico" },
        { "$group": {
            "_id": "$resgate.endereco.estado",
            "custo_total": { "$sum": "$historico_medico.custo_estimado" },
            "media_por_procedimento": { "$avg": "$historico_medico.custo_estimado" },
            "quantidade_procedimentos": { "$sum": 1 }
        }},
        { "$sort": { "custo_total": -1 } },
        { "$limit": 10 }
    ]
    df_custos = df_seguro(executar_agregacao(pipeline_custo))
    if not df_custos.empty:
        df_custos.rename(columns={"_id": "Estado", "custo_total": "Custo Total (R$)", "media_por_procedimento": "Média/Procedimento (R$)"}, inplace=True)
        fig_custo = px.bar(df_custos, y="Estado", x="Custo Total (R$)", orientation='h', title="Top 10 - Custo Médico Regional", color="Custo Total (R$)", hover_data=["Média/Procedimento (R$)"], color_continuous_scale="Reds")
        fig_custo.update_layout(yaxis={'categoryorder':'total ascending'})
        st.plotly_chart(fig_custo, use_container_width=True)

st.divider()

col_demo1, col_demo2 = st.columns(2)

# --- CONSULTA 7 DO WORD: Demografia Canina vs Felina por Zona ---
with col_demo1:
    pipeline_demografia = [
        { "$match": { "resgate.endereco.zona": { "$in": ["Norte", "Sul", "Leste", "Oeste", "Centro"] } } },
        { "$group": { "_id": { "zona": "$resgate.endereco.zona", "especie": "$animal.especie" }, "quantidade": { "$sum": 1 } } },
        { "$sort": { "_id.zona": 1, "quantidade": -1 } }
    ]
    df_demo = df_seguro(executar_agregacao(pipeline_demografia))
    if not df_demo.empty:
        df_demo['Zona'] = df_demo['_id'].apply(lambda x: x['zona'])
        df_demo['Espécie'] = df_demo['_id'].apply(lambda x: x['especie'])
        fig_demo = px.bar(df_demo, x="Zona", y="quantidade", color="Espécie", barmode="group", title="Demografia de Resgates por Zona")
        st.plotly_chart(fig_demo, use_container_width=True)

# --- CONSULTA 3 DO WORD: Risco de Devolução por Perfil Habitacional ---
with col_demo2:
    pipeline_risco = [
        { "$unwind": "$historico_adocoes" },
        { "$match": { "historico_adocoes.status_adocao": "DEVOLVIDO", "animal.porte": "Grande" } },
        { "$group": { "_id": "$historico_adocoes.perfil_adotante.tipo_moradia", "quantidade_devolucoes": { "$sum": 1 } } },
        { "$sort": { "quantidade_devolucoes": -1 } }
    ]
    df_risco = df_seguro(executar_agregacao(pipeline_risco))
    if not df_risco.empty:
        df_risco.rename(columns={"_id": "Tipo de Moradia", "quantidade_devolucoes": "Devoluções"}, inplace=True)
        fig_risco = px.pie(df_risco, values="Devoluções", names="Tipo de Moradia", hole=0.4, title="Risco: Moradias que mais devolvem animais Grandes")
        st.plotly_chart(fig_risco, use_container_width=True)

st.divider()

st.subheader("Análise Clínica e Desempenho Operacional")
col_clin1, col_clin2 = st.columns(2)

# --- CONSULTA 4 DO WORD: O Fator 'Deficiência' no Tempo de Espera ---
with col_clin1:
    st.markdown("**Impacto da Deficiência no Tempo de Adoção**")
    pipeline_deficiencia = [
        { "$unwind": "$historico_adocoes" },
        { "$match": { "historico_adocoes.status_adocao": "VIGENTE" } },
        { "$project": {
            "tem_deficiencia": { "$gt": [{ "$size": { "$ifNull": ["$animal.deficiencias", []] } }, 0] },
            "tempo_espera": "$historico_adocoes.tempo_espera_dias"
        }},
        { "$group": { "_id": "$tem_deficiencia", "tempo_medio_espera_dias": { "$avg": "$tempo_espera" }, "animais_adotados": { "$sum": 1 } } }
    ]
    df_def = df_seguro(executar_agregacao(pipeline_deficiencia))
    
    if not df_def.empty:
        df_def['Perfil'] = df_def['_id'].apply(lambda x: "Com Deficiência" if x else "Sem Deficiência")
        
        # 1. Renomeamos a coluna crua do MongoDB para um nome amigável para o ecrã
        df_def.rename(columns={"tempo_medio_espera_dias": "Média de Espera (Dias)"}, inplace=True)
        
        # 2. Atualizamos o eixo Y com o novo nome
        fig_def = px.bar(
            df_def, 
            x="Perfil", 
            y="Média de Espera (Dias)", 
            color="Perfil", 
            text_auto='.0f', 
            title="Média de Dias à Espera de Adoção"
        )
        fig_def.update_layout(showlegend=False)
        st.plotly_chart(fig_def, use_container_width=True)

# --- CONSULTA 10 DO WORD: Custos Médicos Fatais ---
with col_clin2:
    st.markdown("**Custo Médio de Salvamento Antes do Óbito**")
    pipeline_obito = [
        { "$match": { "status_atual": "OBITO" } },
        { "$unwind": { "path": "$historico_medico", "preserveNullAndEmptyArrays": False } },
        { "$group": { "_id": "$_id", "custo_total_animal": { "$sum": "$historico_medico.custo_estimado" }, "causa_chegada": { "$first": "$resgate.condicao_chegada" } } },
        { "$group": { "_id": "$causa_chegada", "custo_medio_tentativa_salvamento": { "$avg": "$custo_total_animal" }, "total_obitos": { "$sum": 1 } } },
        { "$sort": { "custo_medio_tentativa_salvamento": -1 } }
    ]
    df_obito = df_seguro(executar_agregacao(pipeline_obito))
    if not df_obito.empty:
        df_obito.rename(columns={"_id": "Causa Inicial", "custo_medio_tentativa_salvamento": "Custo Médio (R$)", "total_obitos": "Óbitos Registados"}, inplace=True)
        st.dataframe(df_obito.style.format({"Custo Médio (R$)": "R$ {:.2f}"}), use_container_width=True)

col_tab1, col_tab2 = st.columns(2)

# --- CONSULTA 6 DO WORD: Ranking de Eficiência das ONGs ---
with col_tab1:
    st.markdown("**🏆 Top 5 ONGs (Adoções Definitivas)**")
    pipeline_ongs = [
        { "$match": { "status_atual": "ADOTADO" } },
        { "$project": { "ong": "$ong_responsavel.nome_fantasia", "ultima_adocao": { "$arrayElemAt": ["$historico_adocoes", -1] } } },
        { "$match": { "ultima_adocao.status_adocao": "VIGENTE" } },
        { "$group": { "_id": "$ong", "total_sucessos": { "$sum": 1 } } },
        { "$sort": { "total_sucessos": -1 } },
        { "$limit": 5 }
    ]
    df_ongs = df_seguro(executar_agregacao(pipeline_ongs))
    if not df_ongs.empty:
        df_ongs.rename(columns={"_id": "Nome da ONG", "total_sucessos": "Total de Adoções"}, inplace=True)
        st.dataframe(df_ongs, use_container_width=True, hide_index=True)

# --- CONSULTA 9 DO WORD: O Raio-X dos Animais "Encalhados" ---
with col_tab2:
    st.markdown("**⚠️ Alerta: Animais 'Encalhados' (≥ 2 Devoluções)**")
    pipeline_encalhados = [
        { "$match": { "status_atual": "DISPONIVEL" } },
        { "$project": {
            "Nome do Animal": "$animal.nome",
            "ONG": "$ong_responsavel.nome_fantasia",
            "quantidade_devolucoes": { "$size": { "$filter": { "input": { "$ifNull": ["$historico_adocoes", []] }, "as": "adocao", "cond": { "$eq": ["$$adocao.status_adocao", "DEVOLVIDO"] } } } }
        }},
        { "$match": { "quantidade_devolucoes": { "$gte": 2 } } }, # Restabelecido para >= 2 rigorosamente igual ao Word
        { "$sort": { "quantidade_devolucoes": -1 } },
        { "$limit": 5 }
    ]
    df_encalhados = df_seguro(executar_agregacao(pipeline_encalhados))
    
    if not df_encalhados.empty:
        fig_encalhados = px.bar(
            df_encalhados, x="quantidade_devolucoes", y="Nome do Animal", orientation='h',
            color="quantidade_devolucoes", hover_data=["ONG"], color_continuous_scale="Reds", 
            title="Animais com Maior Rejeição Histórica"
        )
        fig_encalhados.update_layout(yaxis={'categoryorder':'total ascending'}, xaxis_title="Nº de Devoluções")
        st.plotly_chart(fig_encalhados, use_container_width=True)
    else:
        st.success("🎉 Excelente notícia! Neste momento, a base de dados não regista animais disponíveis com 2 ou mais devoluções.")

st.caption("Arquitetura e Processamento: Python, PyMongo e MongoDB Aggregation Framework.")