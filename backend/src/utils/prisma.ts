import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Prisma, PrismaClient } from "@prisma/client";

import { env } from "../config/env.js";

const isNeon = new URL(env.DATABASE_URL).hostname.endsWith(".neon.tech");
const adapter = isNeon
  ? new PrismaNeon({ connectionString: env.DATABASE_URL })
  : new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({
  adapter,
});

export async function transacaoSerializavel<T>(
  executar: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  for (let tentativa = 0; tentativa < 3; tentativa += 1) {
    try {
      return await prisma.$transaction(executar, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      const conflito =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034";
      if (!conflito || tentativa === 2) throw error;
    }
  }

  throw new Error("Não foi possível concluir a transação.");
}
