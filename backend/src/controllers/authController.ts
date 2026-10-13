import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { env } from "../config/env.js";
import { notificarNovoCadastro } from "../services/notificacaoEmailService.js";

const cadastroSchema = z.object({
  nome: z.string().trim().min(3),
  email: z.email().transform((value) => value.toLowerCase()),
  senha: z
    .string()
    .min(10, "A senha deve ter pelo menos 10 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres")
    .regex(/[A-Za-zÀ-ÿ]/, "A senha deve conter pelo menos uma letra")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
  categoria: z.enum(["INICIAIS", "FINAIS"]),
});

const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  senha: z.string().min(1),
});

export async function register(req: Request, res: Response) {
  try {
    const { nome, email, senha, categoria } = cadastroSchema.parse(req.body);
    const usuarioExiste = await prisma.usuario.findUnique({ where: { email } });

    if (usuarioExiste) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        tipo: "PROFESSOR",
        statusCadastro: "PENDENTE",
        professor: { create: { categoria } },
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        statusCadastro: true,
        createdAt: true,
      },
    });

    void notificarNovoCadastro({
      usuarioId: usuario.id,
      professor: usuario.nome,
      email: usuario.email,
      categoria,
    });

    return res.status(201).json({
      message: "Cadastro enviado. Aguarde a aprovação de um administrador.",
      usuario,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados de cadastro inválidos",
        errors: error.issues,
      });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro ao cadastrar usuário" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, senha } = loginSchema.parse(req.body);
    const consultaUsuario = {
      where: { email },
      include: {
        professor: { select: { categoria: true } },
      },
    } as const;
    let usuario;
    try {
      usuario = await prisma.usuario.findUnique(consultaUsuario);
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P1017")) {
        throw error;
      }
      usuario = await prisma.usuario.findUnique(consultaUsuario);
    }

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(400).json({ message: "E-mail ou senha inválidos" });
    }

    if (usuario.tipo === "PROFESSOR" && usuario.statusCadastro !== "APROVADO") {
      return res.status(403).json({
        message: "Seu cadastro ainda está aguardando aprovação.",
      });
    }
    if (!usuario.ativo) {
      return res.status(403).json({ message: "Esta conta está desativada. Procure a administração." });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        categoria: usuario.professor?.categoria ?? null,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }
    console.error(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      ["P1001", "P1002", "P1017"].includes(error.code)
    ) {
      return res.status(503).json({
        message: "Conexão com o banco de dados indisponível. Tente novamente em instantes.",
      });
    }
    return res.status(500).json({ message: "Erro no login" });
  }
}

export async function minhaConta(req: Request, res: Response) {
  const usuario = req.usuario!;
  const professor = usuario.tipo === "PROFESSOR"
    ? await prisma.professor.findUnique({
        where: { usuarioId: usuario.id },
        select: { categoria: true },
      })
    : null;
  return res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo,
    categoria: professor?.categoria ?? null,
  });
}


