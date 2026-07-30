import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NovoPedido from "../pages/NovoPedido";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Pedidos from "../pages/Pedidos";
import Professores from "../pages/Professores";
import Notebooks from "../pages/Notebooks";
import Relatorios from "../pages/Relatorios";
import MeusPedidos from "../pages/MeusPedidos";
import Configuracoes from "../pages/Configuracoes";
import Cadastro from "../pages/Cadastro";
import PrivateRoute from "./PrivateRoute";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/novo-pedido" element={<PrivateRoute><NovoPedido /></PrivateRoute>} />
        <Route path="/meus-pedidos" element={<PrivateRoute><MeusPedidos /></PrivateRoute>} />
        <Route path="/notebooks" element={<PrivateRoute><Notebooks /></PrivateRoute>} />
        <Route path="/pedidos" element={<PrivateRoute admin><Pedidos /></PrivateRoute>} />
        <Route path="/professores" element={<PrivateRoute admin><Professores /></PrivateRoute>} />
        <Route path="/relatorios" element={<PrivateRoute admin><Relatorios /></PrivateRoute>} />
        <Route path="/configuracoes" element={<PrivateRoute admin><Configuracoes /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
