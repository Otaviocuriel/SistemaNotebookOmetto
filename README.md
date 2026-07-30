<div align="center">
  <img src="./docs/images/logo-escola.png" alt="Logo da E.E. José Ometto" width="180" />

  <h1>Sistema Notebook Ometto</h1>

  <p>Plataforma de gestão e empréstimo de notebooks da E.E. José Ometto</p>
</div>

Sistema web desenvolvido para organizar a solicitação, a entrega e a devolução de notebooks da **E.E. José Ometto**.

O projeto substitui o processo manual no qual alunos precisam procurar os responsáveis pelos equipamentos. Pelo sistema, o professor consulta a disponibilidade, faz o pedido informando a sala e a quantidade necessária e acompanha todo o atendimento. Os administradores recebem a solicitação, registram a entrega, controlam a devolução e mantêm o estoque atualizado.

## Acesse o sistema

- **Aplicação:** https://sistema-notebook-ometto.onrender.com
- **API:** https://sistema-notebook-ometto-api.onrender.com

> O serviço gratuito da API pode levar alguns segundos para responder no primeiro acesso após um período sem uso.

## Principais funcionalidades

### Professor

- solicitação de cadastro com aprovação administrativa;
- login seguro e controle de sessão;
- visualização dos notebooks disponíveis para sua categoria;
- criação de pedidos por sala e quantidade;
- acompanhamento do status dos próprios pedidos;
- solicitação de retirada dos notebooks após o uso;
- escolha entre tema claro e escuro.

### Administrador

- painel com indicadores do sistema;
- aprovação ou rejeição de novos professores;
- edição e exclusão de professores;
- visualização de todos os pedidos;
- registro de entrega, retirada e devolução;
- controle automático da quantidade disponível e em uso;
- gerenciamento separado entre Anos Iniciais e Anos Finais;
- relatórios de utilização;
- configurações do sistema;
- notificações por e-mail para novos cadastros, pedidos e solicitações de retirada.

## Tecnologias utilizadas

### Frontend

- **React** — criação da interface;
- **TypeScript** — tipagem e segurança no desenvolvimento;
- **Vite** — ambiente de desenvolvimento e build;
- **Tailwind CSS** — estilização e responsividade;
- **React Router** — navegação entre as páginas;
- **React Hook Form** — gerenciamento de formulários;
- **Axios** — comunicação com a API;
- **Lucide React** — ícones da interface;
- **Zod** — validação de dados.

### Backend

- **Node.js** — execução do servidor;
- **Express** — criação da API REST;
- **TypeScript** — tipagem do backend;
- **Prisma ORM** — acesso e gerenciamento do banco de dados;
- **PostgreSQL** — armazenamento dos dados;
- **JWT** — autenticação dos usuários;
- **bcrypt** — proteção das senhas;
- **Zod** — validação das requisições;
- **Resend** — envio das notificações por e-mail.

### Infraestrutura

- **Render** — hospedagem do frontend e do backend;
- **Neon** — banco de dados PostgreSQL em produção;
- **GitHub** — versionamento e organização do código.

## Estrutura do repositório

```text
SistemaNotebookOmetto/
├── backend/     # API, regras de negócio, Prisma e banco de dados
├── frontend/    # Interface React
└── README.md
```

## Perfis e permissões

- **Professor:** consulta disponibilidade, cria solicitações e acompanha apenas os próprios pedidos.
- **Administrador:** gerencia pedidos, estoque, professores, relatórios e configurações.

O cadastro público cria somente contas de professor, que precisam ser aprovadas. As contas administrativas são configuradas de forma segura no backend.

## Executando localmente

### Backend

1. Copie `backend/.env.example` para `backend/.env`.
2. Preencha as variáveis de ambiente necessárias.
3. Execute:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

### Frontend

1. Copie `frontend/.env.example` para `frontend/.env`, se necessário.
2. Execute:

```bash
cd frontend
npm install
npm run dev
```

## Validação do projeto

```bash
cd backend
npm run build

cd ../frontend
npm run build
npm run lint
```

## Autor

Desenvolvido por **Otávio Curiel** como uma solução para uma necessidade real da E.E. José Ometto.
