import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { env } from "../config/env.js";

const cadastroSchema = z.object({
  nome: z.string().trim().min(3),
  email: z.email().transform((value) => value.toLowerCase()),
  senha: z.string().min(6),
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
        professor: { create: { categoria } },
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Usuário criado com sucesso",
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
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        professor: { select: { categoria: true } },
      },
    });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(400).json({ message: "E-mail ou senha inválidos" });
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
    return res.status(500).json({ message: "Erro no login" });
  }
}
