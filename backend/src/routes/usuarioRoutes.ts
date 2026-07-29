import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import {
  aprovarProfessor,
  editarProfessor,
  excluirProfessor,
  listarProfessores,
  listarSolicitacoesCadastro,
  recusarProfessor,
} from "../controllers/usuarioController.js";

const router = Router();
router.get("/solicitacoes", authMiddleware, adminMiddleware, listarSolicitacoesCadastro);
router.patch("/solicitacoes/:id/aprovar", authMiddleware, adminMiddleware, aprovarProfessor);
router.delete("/solicitacoes/:id", authMiddleware, adminMiddleware, recusarProfessor);
router.get("/professores", authMiddleware, adminMiddleware, listarProfessores);
router.put("/professores/:id", authMiddleware, adminMiddleware, editarProfessor);
router.delete("/professores/:id", authMiddleware, adminMiddleware, excluirProfessor);
export default router;

