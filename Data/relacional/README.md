# 🗄️ Dados e Modelação 
<br>
<img width="300"  src="../../Img/OneHelp_Branco.png" alt="Num sabo"> 

--- 
## 📖 Sobre a Pasta

Esta pasta armazena toda a **arquitetura e estruturação da base de dados relacional** que sustenta o ecossistema OneHelp (tanto o painel administrativo quanto o website público).

A modelação de dados é um passo fundamental para garantir que as informações dos animais, adotantes, funcionários e voluntários sejam guardadas de forma segura, íntegra e sem redundâncias.

## 📂 Estrutura de Ficheiros

O planeamento da nossa base de dados foi dividido em duas fases, organizadas nas seguintes subpastas:

### 🧠 `modelo_conceitual/`
Contém a visão de alto nível (macro) do sistema.
- **`OneHelp_Conceitual.png`**: Imagem exportada para visualização rápida. Mapeia as principais entidades (ex: Animais, Adotantes) e os seus relacionamentos (ex: "Um adotante adota um ou mais animais").
- **`OneHelp_Conceitual.brM3`**: Ficheiro de projeto editável.

### ⚙️ `modelo_logico/`
Contém o mapeamento detalhado e técnico, mais próximo da implementação real.
- **`OneHelp_Logico.png`**: Imagem exportada com a estrutura exata das tabelas.
- **`OneHelp_Logico.brM3`**: Ficheiro de projeto editável, onde já estão definidas as **Chaves Primárias (PK)**, **Chaves Estrangeiras (FK)** e os tipos de dados de cada coluna (VARCHAR, INT, DATE, etc.).

---

## ⚠️ Regra de Sincronização

**Atenção Equipa de Backend:** Qualquer alteração feita nos modelos da aplicação em Django (na pasta `Sistema/Backend/.../models.py`) que afete a estrutura da base de dados, **deve** ser refletida primeiro nestes diagramas. 

A documentação da pasta `Data` deve ser sempre a fonte da verdade ("*Single Source of Truth*") para a estrutura dos nossos dados.

## 🛠 Tecnologias Utilizadas

<img src="https://img.shields.io/badge/brModelo-005B9F?style=for-the-badge&logo=diagrams.net&logoColor=white" alt="brModelo" /> <img src="https://img.shields.io/badge/Bases_de_Dados_Relacionais-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="Bases de Dados" />