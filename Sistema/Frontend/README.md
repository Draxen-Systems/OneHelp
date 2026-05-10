# OneHelp - Front-end (ONG Bicho Carente)

Este é o repositório front-end do sistema OneHelp, desenvolvido para a gestão da ONG Bicho Carente. O projeto foi construído utilizando React e Vite.

## 🛠️ Tecnologias e Dependências Principais

A interface utiliza as seguintes bibliotecas principais:

* **React (v19)**
* **Vite (v8)**
* **React Router Dom:** Gerenciamento de rotas e navegação da aplicação.
* **React Hook Form:** Gerenciamento e validação de formulários.
* **React Number Format:** Formatação e máscaras de inputs numéricos.
* **SweetAlert2:** Modais e alertas customizados.
* **Lucide React:** Biblioteca de ícones.

## ⚙️ Pré-requisitos

* [Node.js](https://nodejs.org/) (Versão 18 ou superior)

### 📦 Instalação

dentro das pastas webiste ou sistema/frontend deve ser rodado estes comandos para instalação de todas as dependencias

```bash
npm install
npm install lucide-react react react-dom react-hook-form react-number-format react-router-dom sweetalert2
```

## 🚀 Comandos do Projeto

Para acessar o website 🎨

```bash
cd website
npm run dev
```

Para acessar o sistema 💻

```bash
cd sistema
cd frontend
```

abra um cmd e deixe ele rodando este comando ⬇️
```bash
json-server --watch db.json --port 3001 
```

abra outro cmd e rode este comando ⬇️

```bash
npm run dev
```