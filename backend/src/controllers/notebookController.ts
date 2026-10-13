import type { Request, Response } from "express";
import { z } from "zod";
import { prisma, transacaoSerializavel } from "../utils/prisma.js";
import { solicitavel, totalSuportaCompromissos } from "../utils/estoque.js";

const notebookSchema = z.object({
  total: z.number().int().nonnegative(),
});

export async function listarNotebooks(_req: Request, res: Response) {
  const notebooks = await prisma.notebook.findMany({
    orderBy: { categoria: "asc" },
  });
  const reservas = await Promise.all(
    notebooks.map((notebook) =>
      prisma.pedido.aggregate({
        where: { categoria: notebook.categoria, status: "PENDENTE" },
        _sum: { quantidade: true },
      })
    )
  );

  return res.json(
    notebooks.map((notebook, indice) => {
      const reservado = reservas[indice]!._sum.quantidade ?? 0;
      return {
        ...notebook,
        reservado,
        solicitavel: solicitavel(notebook.disponivel, reservado),
      };
    })
  );
}

export async function salvarNotebook(req: Request, res: Response) {
  try {
    const categoria = z.enum(["INICIAIS", "FINAIS"]).parse(req.params.categoria);
    const { total } = notebookSchema.parse(req.body);
    const notebook = await transacaoSerializavel(async (tx) => {
      const atual = await tx.notebook.findUnique({ where: { categoria } });
      const reservas = await tx.pedido.aggregate({
        where: { categoria, status: "PENDENTE" },
        _sum: { quantidade: true },
      });
      const emUso = atual?.emUso ?? 0;
      const reservado = reservas._sum.quantidade ?? 0;

      if (!totalSuportaCompromissos(total, emUso, reservado)) {
        throw new Error("TOTAL_INSUFICIENTE");
      }

      return tx.notebook.upsert({
        where: { categoria },
        create: { categoria, total, emUso: 0, disponivel: total },
        update: { total, disponivel: total - emUso },
      });
    });
    return res.json(notebook);
  } catch (error) {
    if (error instanceof Error && error.message === "TOTAL_INSUFICIENTE") {
      return res.status(409).json({
        message: "O total não pode ser menor que os notebooks em uso e reservados por pedidos pendentes.",
      });
    }
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados do estoque inválidos." });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro ao salvar estoque." });
  }
}
