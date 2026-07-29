import {
  House, ClipboardList, Laptop, Users, ChartColumn,
  Settings, PlusCircle, History,
} from "lucide-react";
import MenuItem from "./MenuItem";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { usuario } = useAuth();
  const admin = usuario?.tipo === "ADMIN";

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-slate-200 flex flex-col">
      <div className="flex items-center gap-3 border-b p-5">
        <img
          src="/logo-ometto.svg"
          alt="E.E. José Ometto"
          className="h-14 w-14 rounded-full border border-slate-200 object-cover"
        />
        <div>
          <h1 className="text-xl font-bold leading-tight text-blue-700">Notebook Ometto</h1>
          <p className="mt-1 text-xs text-slate-500">
            {admin ? "Painel Administrativo" : "Portal do Professor"}
          </p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <MenuItem to="/dashboard" label="Dashboard" icon={House} />
        {!admin && (
          <>
            <p className="text-xs font-semibold uppercase text-slate-400 px-3 pt-4">Solicitações</p>
            <MenuItem to="/novo-pedido" label="Novo Pedido" icon={PlusCircle} />
            <MenuItem to="/meus-pedidos" label="Meus Pedidos" icon={History} />
            <MenuItem to="/notebooks" label="Notebooks disponíveis" icon={Laptop} />
          </>
        )}
        {admin && (
          <>
            <p className="text-xs font-semibold uppercase text-slate-400 px-3 pt-4">Administração</p>
            <MenuItem to="/pedidos" label="Todos os Pedidos" icon={ClipboardList} />
            <MenuItem to="/notebooks" label="Notebooks" icon={Laptop} />
            <MenuItem to="/professores" label="Professores" icon={Users} />
            <MenuItem to="/relatorios" label="Relatórios" icon={ChartColumn} />
            <MenuItem to="/configuracoes" label="Configurações" icon={Settings} />
          </>
        )}
      </nav>
      <div className="border-t p-4 text-center text-sm text-slate-500">
        Sistema Notebook Ometto<br />v1.0.0
      </div>
    </aside>
  );
}

