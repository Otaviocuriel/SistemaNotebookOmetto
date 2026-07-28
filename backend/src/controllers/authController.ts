import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";


export async function register(
  req: Request,
  res: Response
) {

  try {

    const {
      nome,
      email,
      senha,
      tipo,
      categoria,
    } = req.body;



    // Permitir somente Otávio e Gabriel como ADMIN

    if (tipo === "ADMIN") {

  const adminsPermitidos = [
    {
      email: "otavioadmin@gmail.com",
      senha: "otavioadmin@",
      nome: "Otavio",
    },

    {
      email: "gabrieladmin@gmail.com",
      senha: "gabrieladmin@",
      nome: "Gabriel",
    },
  ];



  const adminValido =
    adminsPermitidos.find(
      (admin) =>
        admin.email === email.toLowerCase() &&
        admin.senha === senha
    );



  if (!adminValido) {

    return res.status(400).json({

      message:
        "Administrador não autorizado",

    });

  }

}



    const usuarioExiste =
      await prisma.usuario.findUnique({

        where: {
          email,
        },

      });



    if (usuarioExiste) {

      return res.status(400).json({

        message:
          "Email já cadastrado",

      });

    }



    const senhaHash =
      await bcrypt.hash(senha, 10);



    const dadosUsuario = {

      nome,

      email,

      senha: senhaHash,

      tipo,


      ...(tipo === "PROFESSOR" && {

        professor: {

          create: {

            categoria,

          },

        },

      }),

    };



    const usuario =
      await prisma.usuario.create({

        data: dadosUsuario,

      });



    return res.status(201).json({

      message:
        "Usuário criado com sucesso",

      usuario,

    });


  } catch (error) {

    console.error(error);


    return res.status(500).json({

      message:
        "Erro ao cadastrar usuário",

    });

  }

}



// LOGIN

export async function login(
  req: Request,
  res: Response
) {

  try {

    const {
      email,
      senha,
    } = req.body;



    const usuario =
      await prisma.usuario.findUnique({

        where: {
          email,
        },

      });



    if (!usuario) {

      return res.status(400).json({

        message:
          "Usuário não encontrado",

      });

    }



    const senhaValida =
      await bcrypt.compare(
        senha,
        usuario.senha
      );



    if (!senhaValida) {

      return res.status(400).json({

        message:
          "Senha incorreta",

      });

    }



    const token =
      jwt.sign(

        {
          id: usuario.id,
          tipo: usuario.tipo,
        },

        "segredo_notebook",

        {
          expiresIn: "1d",
        }

      );



    return res.json({

      message:
        "Login realizado com sucesso",


      token,


      usuario: {

        id: usuario.id,

        nome: usuario.nome,

        email: usuario.email,

        tipo: usuario.tipo,

      },

    });


  } catch(error) {

    console.error(error);


    return res.status(500).json({

      message:
        "Erro no login",

    });

  }

}