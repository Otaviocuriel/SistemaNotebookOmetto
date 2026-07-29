import {
  House,
  ClipboardList,
  Laptop,
  Users,
  ChartColumn,
  Settings,
  PlusCircle,
  History,
  X,
  LogOut,
} from "lucide-react";
import MenuItem from "./MenuItem";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  aberto: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({ aberto, onClose, onLogout }: SidebarProps) {
  const { usuario } = useAuth();
  const admin = usuario?.tipo === "ADMIN";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex min-h-screen w-[280px] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
        aberto ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <img
          src="/logo-ometto.svg"
          alt="E.E. José Ometto"
          className="h-12 w-12 rounded-full border border-slate-200 object-cover"
        />
        <div>
          <h1 className="text-lg font-bold leading-tight text-slate-900">
            Notebook Ometto
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {admin ? "Painel Administrativo" : "Portal do Professor"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <MenuItem to="/dashboard" label="Dashboard" icon={House} onClick={onClose} />

        {!admin && (
          <>
            <p className="px-3 pt-4 text-xs font-semibold uppercase text-slate-400">
              Solicitações
            </p>
            <MenuItem to="/novo-pedido" label="Novo Pedido" icon={PlusCircle} onClick={onClose} />
            <MenuItem to="/meus-pedidos" label="Meus Pedidos" icon={History} onClick={onClose} />
            <MenuItem to="/notebooks" label="Notebooks disponíveis" icon={Laptop} onClick={onClose} />
          </>
        )}

        {admin && (
          <>
            <p className="px-3 pt-4 text-xs font-semibold uppercase text-slate-400">
              Administração
            </p>
            <MenuItem to="/pedidos" label="Todos os Pedidos" icon={ClipboardList} onClick={onClose} />
            <MenuItem to="/notebooks" label="Notebooks" icon={Laptop} onClick={onClose} />
            <MenuItem to="/professores" label="Professores" icon={Users} onClick={onClose} />
            <MenuItem to="/relatorios" label="Relatórios" icon={ChartColumn} onClick={onClose} />
            <MenuItem to="/configuracoes" label="Configurações" icon={Settings} onClick={onClose} />
          </>
        )}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
        <p className="mt-2 px-3 text-xs text-slate-400">Versão 1.1.0</p>
      </div>
    </aside>
  );
}


