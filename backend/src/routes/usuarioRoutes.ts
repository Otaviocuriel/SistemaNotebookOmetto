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
  alterarMinhaSenha,
  reativarProfessor,
} from "../controllers/usuarioController.js";
import { createRateLimiter } from "../middlewares/securityMiddleware.js";

const router = Router();
const senhaLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Muitas tentativas. Aguarde uma hora para alterar a senha.",
});
router.patch("/me/senha", authMiddleware, senhaLimiter, alterarMinhaSenha);
router.get("/solicitacoes", authMiddleware, adminMiddleware, listarSolicitacoesCadastro);
router.patch("/solicitacoes/:id/aprovar", authMiddleware, adminMiddleware, aprovarProfessor);
router.delete("/solicitacoes/:id", authMiddleware, adminMiddleware, recusarProfessor);
router.get("/professores", authMiddleware, adminMiddleware, listarProfessores);
router.put("/professores/:id", authMiddleware, adminMiddleware, editarProfessor);
router.delete("/professores/:id", authMiddleware, adminMiddleware, excluirProfessor);
router.patch("/professores/:id/reativar", authMiddleware, adminMiddleware, reativarProfessor);
export default router;


