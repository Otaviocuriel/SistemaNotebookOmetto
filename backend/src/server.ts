import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import notebookRoutes from "./routes/notebookRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import { env } from "./config/env.js";
import { securityHeaders } from "./middlewares/securityMiddleware.js";

const app = express();
const allowedOrigins = new Set(
  [
    env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
  ].filter((origin): origin is string => Boolean(origin))
);

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "20kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/notebooks", notebookRoutes);
app.use("/api/pedidos", pedidoRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "API Sistema Notebook Ometto funcionando" });
});

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Erro não tratado:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
);

app.listen(env.PORT, () => {
  console.log(`Servidor rodando na porta ${env.PORT}`);
});

