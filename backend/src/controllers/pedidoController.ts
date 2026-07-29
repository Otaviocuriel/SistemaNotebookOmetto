import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { notificarAdministradores } from "../services/notificacaoEmailService.js";

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

    await notificarAdministradores({
      tipo: "NOVO_PEDIDO",
      pedidoId: pedido.id,
      professor: req.usuario!.nome,
      sala: pedido.sala,
      quantidade: pedido.quantidade,
      categoria: professor.categoria,
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

export async function solicitarRetirada(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Pedido inválido." });
  }

  try {
    const professor = await prisma.professor.findUnique({
      where: { usuarioId: req.usuario!.id },
    });
    if (!professor) {
      return res.status(403).json({
        message: "Apenas o professor responsável pode solicitar a retirada.",
      });
    }

    const pedido = await prisma.pedido.findFirst({
      where: { id, professorId: professor.id },
    });
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }
    if (pedido.status !== "EM_USO") {
      return res.status(400).json({
        message: "A retirada só pode ser solicitada para notebooks em uso.",
      });
    }

    const atualizado = await prisma.pedido.update({
      where: { id },
      data: { status: "RETIRADA_SOLICITADA" },
    });

    await notificarAdministradores({
      tipo: "RETIRADA_SOLICITADA",
      pedidoId: atualizado.id,
      professor: req.usuario!.nome,
      sala: atualizado.sala,
      quantidade: atualizado.quantidade,
      categoria: professor.categoria,
    });

    return res.json(atualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao solicitar a retirada." });
  }
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
        const pedidoAtualizado = await tx.pedido.updateMany({
          where: { id, status: "PENDENTE" },
          data: { status: "EM_USO" },
        });
        if (pedidoAtualizado.count !== 1) {
          throw new Error("STATUS_INVALIDO");
        }

        const estoqueAtualizado = await tx.notebook.updateMany({
          where: {
            categoria: pedido.professor.categoria,
            disponivel: { gte: pedido.quantidade },
          },
          data: {
            disponivel: { decrement: pedido.quantidade },
            emUso: { increment: pedido.quantidade },
          },
        });
        if (estoqueAtualizado.count !== 1) {
          throw new Error("ESTOQUE_INSUFICIENTE");
        }
      } else {
        const pedidoAtualizado = await tx.pedido.updateMany({
          where: { id, status: "RETIRADA_SOLICITADA" },
          data: { status: "FINALIZADO" },
        });
        if (pedidoAtualizado.count !== 1) {
          throw new Error("RETIRADA_NAO_SOLICITADA");
        }

        const estoqueAtualizado = await tx.notebook.updateMany({
          where: {
            categoria: pedido.professor.categoria,
            emUso: { gte: pedido.quantidade },
          },
          data: {
            disponivel: { increment: pedido.quantidade },
            emUso: { decrement: pedido.quantidade },
          },
        });
        if (estoqueAtualizado.count !== 1) {
          throw new Error("ESTOQUE_INCONSISTENTE");
        }
      }

      return tx.pedido.findUniqueOrThrow({ where: { id } });
    });
    return res.json(resultado);
  } catch (error) {
    const key = error instanceof Error ? error.message : "";
    const messages: Record<string, string> = {
      RETIRADA_NAO_SOLICITADA: "O professor ainda não solicitou a retirada.",
      PEDIDO_NAO_ENCONTRADO: "Pedido não encontrado.",
      STATUS_INVALIDO: "O pedido não pode mudar para esse status.",
      ESTOQUE_INSUFICIENTE: "Não há notebooks suficientes disponíveis.",
      ESTOQUE_INCONSISTENTE: "O estoque em uso está inconsistente.",
    };
    if (messages[key]) return res.status(400).json({ message: messages[key] });
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar pedido." });
  }
}


