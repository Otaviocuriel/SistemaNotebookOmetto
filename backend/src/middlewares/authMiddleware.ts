import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import { prisma } from "../utils/prisma.js";
import { env } from "../config/env.js";

interface TokenPayload {
  id: number;
  tipo: "ADMIN" | "PROFESSOR";
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "Token não informado",
      });
    }

    const [tipoToken, token] = authorization.split(" ");

    if (tipoToken !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Formato do token inválido",
      });
    }

    const tokenDecodificado = jwt.verify(
      token,
      env.JWT_SECRET
    ) as TokenPayload;

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: tokenDecodificado.id,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
      },
    });

    if (!usuario) {
      return res.status(401).json({
        message: "Usuário do token não encontrado",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Token inválido ou expirado",
    });
  }
}