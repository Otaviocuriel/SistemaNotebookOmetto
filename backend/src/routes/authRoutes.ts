import { Router } from "express";
import { 
  register,
  login,
} from "../controllers/authController.js";
import { createRateLimiter } from "../middlewares/securityMiddleware.js";


const router = Router();

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Muitas tentativas de login. Aguarde 15 minutos e tente novamente.",
});

const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Muitos cadastros enviados. Aguarde uma hora e tente novamente.",
});

router.post(
  "/register",
  registerLimiter,
  register
);



router.post(
  "/login",
  loginLimiter,
  login
);



export default router;

