import { Router } from "express";
import { listarNotebooks, salvarNotebook } from "../controllers/notebookController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();
router.get("/", authMiddleware, listarNotebooks);
router.put("/:categoria", authMiddleware, adminMiddleware, salvarNotebook);
export default router;
