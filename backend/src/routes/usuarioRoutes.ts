import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { listarProfessores } from "../controllers/usuarioController.js";

const router = Router();
router.get("/professores", authMiddleware, adminMiddleware, listarProfessores);
export default router;
