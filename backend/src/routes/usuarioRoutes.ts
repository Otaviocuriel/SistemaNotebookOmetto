import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import {
  editarProfessor,
  excluirProfessor,
  listarProfessores,
} from "../controllers/usuarioController.js";

const router = Router();
router.get("/professores", authMiddleware, adminMiddleware, listarProfessores);
router.put("/professores/:id", authMiddleware, adminMiddleware, editarProfessor);
router.delete("/professores/:id", authMiddleware, adminMiddleware, excluirProfessor);
export default router;
