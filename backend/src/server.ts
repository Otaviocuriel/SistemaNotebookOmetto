import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";


const app = express();


app.use(cors());

app.use(express.json());



// Rotas

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/usuarios",
  usuarioRoutes
);



app.get("/", (req, res) => {

  res.json({

    message:
      "API Sistema Notebook Ometto funcionando"

  });

});



app.listen(3333, () => {

  console.log(
    "Servidor rodando na porta 3333"
  );

});