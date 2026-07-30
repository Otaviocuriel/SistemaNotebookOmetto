<div align="center">
  <img src="./docs/images/logo-escola.png" alt="Logo da E.E. José Ometto" width="180" />


# Sistema Notebook Ometto

### Plataforma de gestão e empréstimo de notebooks escolares

Controle de **solicitações**, **estoque**, **entregas**, **devoluções** e **professores** da E.E. José Ometto.

<br />

[![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br />

[**Acessar o sistema**](https://sistema-notebook-ometto.onrender.com) · [**Acessar a API**](https://sistema-notebook-ometto-api.onrender.com)

</div>

---

## Sobre o projeto

O **Sistema Notebook Ometto** foi criado para modernizar o empréstimo de notebooks da **E.E. José Ometto**.

Antes, alunos precisavam sair da sala para avisar quantos equipamentos o professor necessitava. Agora, o professor consulta a disponibilidade, informa a sala e envia o pedido pelo sistema. Os administradores acompanham a solicitação, registram a entrega e controlam a devolução dos equipamentos.

> **Resumo:** uma solução simples e centralizada para organizar os notebooks da escola e reduzir interrupções durante as aulas.

---

## Funcionalidades

### Portal do professor

- Solicitação de cadastro com aprovação de um administrador.
- Consulta de notebooks disponíveis por categoria.
- Novo pedido com sala e quantidade.
- Acompanhamento do status dos próprios pedidos.
- Solicitação de retirada após a utilização.
- Tema claro e escuro.

### Painel administrativo

- Dashboard com indicadores do sistema.
- Aprovação e rejeição de novos professores.
- Edição e exclusão de professores.
- Controle de pedidos, entregas e devoluções.
- Estoque automático de notebooks disponíveis e em uso.
- Separação entre **Anos Iniciais** e **Anos Finais**.
- Relatórios de utilização.
- Configurações do sistema.
- Notificações por e-mail para cadastros, pedidos e retiradas.

---

## Stack

| Camada | Tecnologias |
|---|---|
| Frontend | React, TypeScript, Vite, React Router |
| Interface | Tailwind CSS, Lucide React |
| Formulários | React Hook Form, Zod |
| Backend | Node.js, Express, TypeScript |
| Banco de dados | PostgreSQL, Neon, Prisma ORM |
| Autenticação | JWT, bcrypt |
| Integrações | Axios, Resend |
| Deploy | Render |
| Versionamento | Git, GitHub |

---

## Arquitetura

```text
SistemaNotebookOmetto/
├── frontend/                 # Aplicação React
│   ├── public/               # Imagens e arquivos públicos
│   └── src/
│       ├── components/       # Componentes reutilizáveis
│       ├── context/          # Autenticação, tema e configurações
│       ├── layouts/          # Estrutura das páginas
│       ├── pages/            # Telas do sistema
│       ├── routes/           # Rotas e proteção de acesso
│       └── services/         # Comunicação com a API
│
├── backend/                  # API REST
│   ├── prisma/               # Schema e migrations
│   └── src/
│       ├── controllers/      # Regras das requisições
│       ├── middlewares/      # Autenticação e permissões
│       ├── routes/           # Endpoints da API
│       ├── scripts/          # Seed dos administradores
│       ├── services/         # Serviços de e-mail
│       └── utils/            # Configurações compartilhadas
│
└── README.md
```

---

## Fluxo do empréstimo

```text
Professor envia o pedido
          ↓
Administrador recebe a solicitação
          ↓
Notebooks são entregues e o estoque é atualizado
          ↓
Professor solicita a retirada
          ↓
Administrador confirma a devolução
          ↓
Notebooks voltam a ficar disponíveis
```

---

## Perfis de acesso

| Recurso | Professor | Administrador |
|---|:---:|:---:|
| Consultar disponibilidade | ✅ | ✅ |
| Criar pedido | ✅ | — |
| Ver os próprios pedidos | ✅ | — |
| Gerenciar todos os pedidos | — | ✅ |
| Gerenciar notebooks | — | ✅ |
| Aprovar professores | — | ✅ |
| Acessar relatórios | — | ✅ |
| Alterar configurações | — | ✅ |

O cadastro público cria somente contas de professor. Cada solicitação precisa ser aprovada antes que o usuário possa entrar no sistema.

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/Otaviocuriel/SistemaNotebookOmetto.git
cd SistemaNotebookOmetto
```

### 2. Configure e inicie o backend

```bash
cd backend
npm install
```

Copie `.env.example` para `.env` e preencha as variáveis necessárias.

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

A API estará disponível em:

```text
http://localhost:3333
```

### 3. Inicie o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```
## Scripts

### Backend

| Comando | Função |
|---|---|
| `npm run dev` | Inicia a API em desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Aplica migrations no banco local |
| `npm run seed` | Configura administradores e estoque inicial |

### Frontend

| Comando | Função |
|---|---|
| `npm run dev` | Inicia o frontend em desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run lint` | Verifica a qualidade do código |

---

## Status atual

- ✅ Frontend e backend publicados.
- ✅ Banco PostgreSQL em produção.
- ✅ Autenticação e permissões por perfil.
- ✅ Estoque atualizado automaticamente.
- ✅ Aprovação de professores.
- ✅ Notificações por e-mail.
- ✅ Interface responsiva com tema claro e escuro.

> No plano gratuito, a API pode levar alguns segundos para responder no primeiro acesso após um período sem uso.

---

## Autor

<div align="center">

Desenvolvido por **Otávio Curiel** para atender uma necessidade real da E.E. José Ometto.

[![GitHub](https://img.shields.io/badge/GitHub-Otaviocuriel-181717?style=for-the-badge&logo=github)](https://github.com/Otaviocuriel)

</div>
