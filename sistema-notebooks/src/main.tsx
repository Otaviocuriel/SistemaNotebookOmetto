import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { NotebookProvider } from "./context/NotebookContext";
import { PedidoProvider } from "./context/PedidoContext";
import { AuthProvider } from "./context/AuthContext";


ReactDOM.createRoot(
  document.getElementById("root")!
).render(

  <React.StrictMode>


    <AuthProvider>


      <NotebookProvider>


        <PedidoProvider>


          <App />


        </PedidoProvider>


      </NotebookProvider>


    </AuthProvider>


  </React.StrictMode>

);