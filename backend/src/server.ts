import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import notebookRoutes from "./routes/notebookRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import { env } from "./config/env.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/notebooks", notebookRoutes);
app.use("/api/pedidos", pedidoRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "API Sistema Notebook Ometto funcionando" });
});

app.listen(env.PORT, () => {
  console.log(`Servidor rodando na porta ${env.PORT}`);
});
