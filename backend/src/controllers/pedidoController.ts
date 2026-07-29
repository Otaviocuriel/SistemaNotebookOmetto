import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";

const novoPedidoSchema = z.object({
  sala: z.string().trim().min(2).max(30),
  quantidade: z.number().int().positive(),
});

export async function criarPedido(req: Request, res: Response) {
  try {
    const { sala, quantidade } = novoPedidoSchema.parse(req.body);
    const professor = await prisma.professor.findUnique({
      where: { usuarioId: req.usuario!.id },
    });
    if (!professor) {
      return res.status(403).json({ message: "Apenas professores podem criar pedidos." });
    }

    const estoque = await prisma.notebook.findUnique({
      where: { categoria: professor.categoria },
    });
    if (!estoque || quantidade > estoque.disponivel) {
      return res.status(400).json({
        message: "Quantidade maior que o estoque disponível.",
      });
    }

    const pedido = await prisma.pedido.create({
      data: { professorId: professor.id, sala, quantidade },
    });
    return res.status(201).json(pedido);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Sala e quantidade válidas são obrigatórias.",
      });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar pedido." });
  }
}

export async function listarPedidos(req: Request, res: Response) {
  const where =
    req.usuario!.tipo === "ADMIN"
      ? {}
      : { professor: { usuarioId: req.usuario!.id } };

  const pedidos = await prisma.pedido.findMany({
    where,
    include: {
      professor: {
        select: {
          categoria: true,
          usuario: { select: { nome: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json(pedidos);
}

export async function entregarPedido(req: Request, res: Response) {
  return alterarStatusComEstoque(req, res, "EM_USO");
}

export async function receberPedido(req: Request, res: Response) {
  return alterarStatusComEstoque(req, res, "FINALIZADO");
}

async function alterarStatusComEstoque(
  req: Request,
  res: Response,
  destino: "EM_USO" | "FINALIZADO"
) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Pedido inválido." });
  }

  try {
    const resultado = await prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.findUnique({
        where: { id },
        include: { professor: true },
      });
      if (!pedido) throw new Error("PEDIDO_NAO_ENCONTRADO");

      if (destino === "EM_USO") {
        if (pedido.status !== "PENDENTE") throw new Error("STATUS_INVALIDO");
        const estoque = await tx.notebook.findUnique({
          where: { categoria: pedido.professor.categoria },
        });
        if (!estoque || estoque.disponivel < pedido.quantidade) {
          throw new Error("ESTOQUE_INSUFICIENTE");
        }
        await tx.notebook.update({
          where: { categoria: pedido.professor.categoria },
          data: {
            disponivel: { decrement: pedido.quantidade },
            emUso: { increment: pedido.quantidade },
          },
        });
      } else {
        if (pedido.status !== "EM_USO") throw new Error("STATUS_INVALIDO");
        await tx.notebook.update({
          where: { categoria: pedido.professor.categoria },
          data: {
            disponivel: { increment: pedido.quantidade },
            emUso: { decrement: pedido.quantidade },
          },
        });
      }

      return tx.pedido.update({
        where: { id },
        data: { status: destino },
      });
    });
    return res.json(resultado);
  } catch (error) {
    const key = error instanceof Error ? error.message : "";
    const messages: Record<string, string> = {
      PEDIDO_NAO_ENCONTRADO: "Pedido não encontrado.",
      STATUS_INVALIDO: "O pedido não pode mudar para esse status.",
      ESTOQUE_INSUFICIENTE: "Não há notebooks suficientes disponíveis.",
    };
    if (messages[key]) return res.status(400).json({ message: messages[key] });
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar pedido." });
  }
}
