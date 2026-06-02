# 🐾 Sistema ONG - PI-2SEM-FATEC

Bem-vindo ao repositório oficial do projeto! Este guia explica como configurar o ambiente de desenvolvimento local e rodar a integração entre o Backend (Django).

## 🛠️ Pré-requisitos
Antes de começar, certifique-se de ter instalado na sua máquina:
- [Python](https://www.python.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (deve estar aberto e rodando em segundo plano)

---

## 🚀 Como rodar o Backend (API REST)

1. **Suba o Banco de Dados (MySQL):**
   Abra o terminal na raiz da pasta do backend e rode o comando abaixo para iniciar o container:
```bash
docker compose up -d
```
*(Aguarde cerca de 15 a 20 segundos na primeira vez para o MySQL configurar as permissões internas).*

2. **Ative o Ambiente Virtual (venv):**
```bash
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```


3. **Instale as Dependências:**
```bash
pip install -r requirements.txt
```


4. **Crie as Tabelas no Banco:**
```bash
python manage.py migrate
```


5. **Ligue o Servidor:**
```bash
python manage.py runserver
```


✅ A API estará disponível em: `http://localhost:8000/api/`

---
