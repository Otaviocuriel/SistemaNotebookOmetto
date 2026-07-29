import type { Request, Response, NextFunction } from "express";


export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {


  if (!req.usuario) {

    return res.status(401).json({

      message:
        "Usuário não autenticado",

    });

  }



  if (req.usuario.tipo !== "ADMIN") {

    return res.status(403).json({

      message:
        "Acesso permitido somente para administradores",

    });

  }



  next();

}