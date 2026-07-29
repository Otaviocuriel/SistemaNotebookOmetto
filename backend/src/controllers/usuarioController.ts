import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

export async function listarProfessores(_req: Request, res: Response) {
  const professores = await prisma.professor.findMany({
    include: {
      usuario: {
        select: { id: true, nome: true, email: true, createdAt: true },
      },
    },
    orderBy: { usuario: { nome: "asc" } },
  });
  return res.json(professores);
}
