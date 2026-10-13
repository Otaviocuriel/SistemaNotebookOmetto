import { emitKeypressEvents } from "node:readline";
import { createInterface } from "node:readline/promises";
import bcrypt from "bcrypt";
import { z } from "zod";

import { prisma } from "../utils/prisma.js";

const passwordSchema = z
  .string()
  .min(10)
  .max(72)
  .regex(/[A-Za-zÀ-ÿ]/)
  .regex(/[0-9]/);

function askHidden(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let answer = "";
    const previousRawMode = process.stdin.isRaw;
    process.stdout.write(question);
    emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    const finish = (error?: Error) => {
      process.stdin.off("keypress", onKeypress);
      process.stdin.setRawMode(previousRawMode);
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(answer);
    };

    const onKeypress = (character: string, key: { name?: string; ctrl?: boolean; meta?: boolean }) => {
      if (key.ctrl && key.name === "c") {
        finish(new Error("Operação cancelada."));
      } else if (key.name === "return" || key.name === "enter") {
        finish();
      } else if (key.name === "backspace") {
        if (answer.length > 0) {
          answer = answer.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else if (character && !key.ctrl && !key.meta && !["escape", "up", "down", "left", "right"].includes(key.name ?? "")) {
        answer += character;
        process.stdout.write("*".repeat([...character].length));
      }
    };

    process.stdin.on("keypress", onKeypress);
  });
}

async function main() {
  if (!process.stdin.isTTY || !process.stdout.isTTY || !process.stdin.setRawMode) {
    throw new Error("Execute este comando em um terminal interativo.");
  }

  const terminal = createInterface({ input: process.stdin, output: process.stdout });
  const email = (await terminal.question("E-mail do administrador: ")).trim().toLowerCase();
  terminal.close();
  if (!z.email().safeParse(email).success) {
    throw new Error("E-mail inválido.");
  }

  const admin = await prisma.usuario.findUnique({
    where: { email },
    select: { id: true, tipo: true, ativo: true },
  });
  if (!admin || admin.tipo !== "ADMIN") {
    throw new Error("Nenhuma conta de administrador encontrada para este e-mail.");
  }
  if (!admin.ativo) {
    throw new Error("Esta conta está desativada; a troca de senha não reativa a conta.");
  }

  const password = await askHidden("Nova senha: ");
  if (!passwordSchema.safeParse(password).success) {
    throw new Error("Use de 10 a 72 caracteres, incluindo letras e números.");
  }
  const confirmation = await askHidden("Confirme a nova senha: ");
  if (password !== confirmation) {
    throw new Error("As senhas não coincidem.");
  }

  await prisma.usuario.update({
    where: { id: admin.id },
    data: { senha: await bcrypt.hash(password, 12) },
  });
  console.log("Senha do administrador atualizada. Faça login com a nova senha.");
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Não foi possível atualizar a senha.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
