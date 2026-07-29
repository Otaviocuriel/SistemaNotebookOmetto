# Sistema Notebook Ometto

Sistema full stack para solicitação, entrega e devolução de notebooks escolares.

## Estrutura

- `sistema-notebooks`: React, TypeScript, Vite e Tailwind CSS.
- `backend`: Node.js, Express, Prisma 7 e PostgreSQL.

## Configuração local

### Backend

1. Copie `backend/.env.example` para `backend/.env`.
2. Preencha `DATABASE_URL`, `JWT_SECRET` e as credenciais dos dois administradores.
3. Execute:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

O seed cria ou atualiza somente os administradores Otávio e Gabriel e inicializa as duas categorias de estoque.

### Frontend

1. Opcionalmente, copie `sistema-notebooks/.env.example` para `sistema-notebooks/.env`.
2. Execute:

```bash
cd sistema-notebooks
npm install
npm run dev
```

## Permissões

- Professor: cadastro público, consulta de disponibilidade, novo pedido e acompanhamento dos próprios pedidos.
- Administrador: pedidos de todos os professores, entrega/devolução, estoque, professores, relatórios e configurações.

O cadastro público sempre cria um professor. Contas administrativas são provisionadas exclusivamente pelo comando `npm run seed`.

## Validação

```bash
cd backend && npm run build
cd sistema-notebooks && npm run build && npm run lint
```
