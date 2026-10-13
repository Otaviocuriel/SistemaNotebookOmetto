import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma, transacaoSerializavel } from "../utils/prisma.js";

const professorSchema = z.object({
  nome: z.string().trim().min(3).max(100),
  email: z.string().trim().email().max(150),
  categoria: z.enum(["INICIAIS", "FINAIS"]),
});

const senhaSchema = z
  .object({
    senhaAtual: z.string().min(1),
    novaSenha: z
      .string()
      .min(10)
      .max(72)
      .regex(/[A-Za-zÀ-ÿ]/)
      .regex(/[0-9]/),
  })
  .refine((dados) => dados.senhaAtual !== dados.novaSenha, {
    message: "A nova senha deve ser diferente da atual.",
    path: ["novaSenha"],
  });

export async function alterarMinhaSenha(req: Request, res: Response) {
  try {
    const { senhaAtual, novaSenha } = senhaSchema.parse(req.body);
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario!.id },
    });

    if (!usuario || !(await bcrypt.compare(senhaAtual, usuario.senha))) {
      return res.status(400).json({ message: "A senha atual está incorreta." });
    }

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { senha: await bcrypt.hash(novaSenha, 10) },
    });

    return res.json({ message: "Senha alterada com sucesso." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message:
          "Use uma senha de 10 a 72 caracteres, contendo letras e números.",
      });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro ao alterar a senha." });
  }
}

export async function listarProfessores(_req: Request, res: Response) {
  const professores = await prisma.professor.findMany({
    where: { usuario: { statusCadastro: "APROVADO" } },
    include: {
      usuario: {
        select: { id: true, nome: true, email: true, ativo: true, createdAt: true },
      },
    },
    orderBy: { usuario: { nome: "asc" } },
  });
  return res.json(professores);
}

export async function listarSolicitacoesCadastro(_req: Request, res: Response) {
  const solicitacoes = await prisma.professor.findMany({
    where: { usuario: { statusCadastro: "PENDENTE" } },
    include: {
      usuario: {
        select: { id: true, nome: true, email: true, createdAt: true },
      },
    },
    orderBy: { usuario: { createdAt: "asc" } },
  });

  return res.json(solicitacoes);
}

export async function aprovarProfessor(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Solicitação inválida." });
  }

  const professor = await prisma.professor.findUnique({
    where: { id },
    include: { usuario: true },
  });

  if (!professor || professor.usuario.statusCadastro !== "PENDENTE") {
    return res.status(404).json({ message: "Solicitação pendente não encontrada." });
  }

  await prisma.usuario.update({
    where: { id: professor.usuarioId },
    data: { statusCadastro: "APROVADO" },
  });

  return res.json({ message: "Professor aprovado com sucesso." });
}

export async function recusarProfessor(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Solicitação inválida." });
  }

  const professor = await prisma.professor.findUnique({
    where: { id },
    include: { usuario: true },
  });

  if (!professor || professor.usuario.statusCadastro !== "PENDENTE") {
    return res.status(404).json({ message: "Solicitação pendente não encontrada." });
  }

  await prisma.$transaction(async (tx) => {
    await tx.professor.delete({ where: { id } });
    await tx.usuario.delete({ where: { id: professor.usuarioId } });
  });

  return res.status(204).send();
}

export async function editarProfessor(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Professor inválido." });
  }

  try {
    const dados = professorSchema.parse(req.body);
    const atualizado = await transacaoSerializavel(async (tx) => {
      const professor = await tx.professor.findUnique({ where: { id } });
      if (!professor) throw new Error("PROFESSOR_NAO_ENCONTRADO");
      if (professor.categoria !== dados.categoria) {
        const pedidosAbertos = await tx.pedido.count({
          where: {
            professorId: id,
            status: { in: ["PENDENTE", "EM_USO", "RETIRADA_SOLICITADA"] },
          },
        });
        if (pedidosAbertos > 0) throw new Error("PEDIDOS_ABERTOS");
      }
      await tx.usuario.update({
        where: { id: professor.usuarioId },
        data: {
          nome: dados.nome,
          email: dados.email.toLowerCase(),
        },
      });

      return tx.professor.update({
        where: { id },
        data: { categoria: dados.categoria },
        include: {
          usuario: {
            select: { id: true, nome: true, email: true, ativo: true, createdAt: true },
          },
        },
      });
    });

    return res.json(atualizado);
  } catch (error) {
    if (error instanceof Error && error.message === "PROFESSOR_NAO_ENCONTRADO") {
      return res.status(404).json({ message: "Professor não encontrado." });
    }
    if (error instanceof Error && error.message === "PEDIDOS_ABERTOS") {
      return res.status(409).json({ message: "Finalize os pedidos abertos antes de alterar a categoria." });
    }
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Confira nome, e-mail e categoria." });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ message: "Este e-mail já está cadastrado." });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro ao editar professor." });
  }
}

export async function excluirProfessor(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Professor inválido." });
  }

  try {
    await transacaoSerializavel(async (tx) => {
      const professor = await tx.professor.findUnique({ where: { id } });
      if (!professor) throw new Error("PROFESSOR_NAO_ENCONTRADO");
      const pedidosAbertos = await tx.pedido.count({
        where: {
          professorId: id,
          status: { in: ["PENDENTE", "EM_USO", "RETIRADA_SOLICITADA"] },
        },
      });
      if (pedidosAbertos > 0) throw new Error("PEDIDOS_ABERTOS");
      await tx.usuario.update({
        where: { id: professor.usuarioId },
        data: { ativo: false },
      });
    });

    return res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === "PROFESSOR_NAO_ENCONTRADO") {
      return res.status(404).json({ message: "Professor não encontrado." });
    }
    if (error instanceof Error && error.message === "PEDIDOS_ABERTOS") {
      return res.status(409).json({ message: "Finalize os pedidos abertos antes de desativar o professor." });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir professor." });
  }
}

export async function reativarProfessor(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Professor inválido." });
  }

  const professor = await prisma.professor.findUnique({
    where: { id },
    include: { usuario: true },
  });
  if (!professor || professor.usuario.statusCadastro !== "APROVADO") {
    return res.status(404).json({ message: "Professor não encontrado." });
  }

  await prisma.usuario.update({
    where: { id: professor.usuarioId },
    data: { ativo: true },
  });
  return res.json({ message: "Professor reativado com sucesso." });
}


