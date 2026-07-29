import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";

const notebookSchema = z.object({
  total: z.number().int().nonnegative(),
});

export async function listarNotebooks(_req: Request, res: Response) {
  const notebooks = await prisma.notebook.findMany({
    orderBy: { categoria: "asc" },
  });
  return res.json(notebooks);
}

export async function salvarNotebook(req: Request, res: Response) {
  try {
    const categoria = z.enum(["INICIAIS", "FINAIS"]).parse(req.params.categoria);
    const { total } = notebookSchema.parse(req.body);
    const atual = await prisma.notebook.findUnique({ where: { categoria } });
    const emUso = atual?.emUso ?? 0;

    if (total < emUso) {
      return res.status(400).json({
        message: "O total não pode ser menor que a quantidade em uso.",
      });
    }

    const notebook = await prisma.notebook.upsert({
      where: { categoria },
      create: { categoria, total, emUso: 0, disponivel: total },
      update: { total, disponivel: total - emUso },
    });
    return res.json(notebook);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados do estoque inválidos." });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro ao salvar estoque." });
  }
}
