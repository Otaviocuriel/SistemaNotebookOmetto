CREATE TYPE "StatusCadastro" AS ENUM ('PENDENTE', 'APROVADO');

ALTER TABLE "Usuario"
ADD COLUMN "statusCadastro" "StatusCadastro" NOT NULL DEFAULT 'APROVADO';
