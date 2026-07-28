import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NovoPedido from "../pages/NovoPedido";
import Login from "../pages/Login";
import Dashboard from "../pages/dashboard";
import Pedidos from "../pages/Pedidos";
import Professores from "../pages/Professores";
import Notebooks from "../pages/Notebooks";
import Relatorios from "../pages/Relatorios";
import MeusPedidos from "../pages/MeusPedidos";
import Configuracoes from "../pages/Configuracoes";


export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/professores" element={<Professores />} />
        <Route path="/notebooks" element={<Notebooks />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/novo-pedido" element={<NovoPedido />} />
        <Route path="/meus-pedidos" element={<MeusPedidos />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </BrowserRouter>
  );
}