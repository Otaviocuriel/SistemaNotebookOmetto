import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";


const router = Router();


router.get(
  "/admin-teste",
  authMiddleware,
  adminMiddleware,
  (req, res) => {

    res.json({

      message:
        "Você é administrador",

      usuario:
        req.usuario.nome,

    });

  }
);


export default router;