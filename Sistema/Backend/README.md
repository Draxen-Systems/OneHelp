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

## 📌 Principais Endpoints da API

### 🐾 Animais
* **GET** `/api/animais/` - Lista todos os animais cadastrados
* **POST** `/api/animais/` - Cadastra um novo animal
* **GET** `/api/animais/{id}/` - Retorna os detalhes de um animal específico
* **PUT** `/api/animais/{id}/` - Atualiza todos os dados de um animal
* **DELETE** `/api/animais/{id}/` - Remove fisicamente um animal do banco

### 🏠 Adotantes
* **GET** `/api/adotantes/` - Lista todos os adotantes cadastrados (CPF e CEP formatados)
* **POST** `/api/adotantes/` - Cadastra um adotante (cria o endereço aninhado automaticamente)
* **GET** `/api/adotantes/{id}/` - Retorna os detalhes do adotante (inclui o endereço completo)
* **PUT** `/api/adotantes/{id}/` - Atualiza os dados do adotante e do endereço associado
* **DELETE** `/api/adotantes/{id}/` - Inativa o adotante no sistema (exclusão lógica / Soft Delete)

### 📍 Endereços
* **GET** `/api/enderecos/` - Lista todos os endereços cadastrados
* **GET** `/api/enderecos/{id}/` - Detalhes de um endereço específico
* **PUT** `/api/enderecos/{id}/` - Atualiza um endereço existente

