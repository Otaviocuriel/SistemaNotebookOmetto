import type { Request, Response } from "express";
import bcrypt from "bcrypt";
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



    const usuarioExiste =
      await prisma.usuario.findUnique({
        where: {
          email,
        },
      });



    if (usuarioExiste) {

      return res.status(400).json({
        message: "Email já cadastrado",
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