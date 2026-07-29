import { Router } from "express";
import {
  criarPedido,
  entregarPedido,
  listarPedidos,
  receberPedido,
  solicitarRetirada,
} from "../controllers/pedidoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();
router.use(authMiddleware);
router.get("/", listarPedidos);
router.post("/", criarPedido);
router.patch("/:id/solicitar-retirada", solicitarRetirada);
router.patch("/:id/entregar", adminMiddleware, entregarPedido);
router.patch("/:id/receber", adminMiddleware, receberPedido);
export default router;

