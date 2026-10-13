ALTER TABLE "Usuario" ADD COLUMN "ativo" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Pedido"
  ADD COLUMN "categoria" "Categoria",
  ADD COLUMN "entregueAt" TIMESTAMP(3),
  ADD COLUMN "finalizadoAt" TIMESTAMP(3);

UPDATE "Pedido" AS pedido
SET "categoria" = professor."categoria"
FROM "Professor" AS professor
WHERE pedido."professorId" = professor."id";

ALTER TABLE "Pedido" ALTER COLUMN "categoria" SET NOT NULL;

CREATE INDEX "Pedido_categoria_status_idx" ON "Pedido"("categoria", "status");
CREATE INDEX "Pedido_createdAt_idx" ON "Pedido"("createdAt");
