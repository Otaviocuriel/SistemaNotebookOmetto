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

export default function Sidebar({
  aberto,
  onClose,
  onLogout,
}: SidebarProps) {
  const { usuario } = useAuth();
  const admin = usuario?.tipo === "ADMIN";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex min-h-screen w-[280px] flex-col border-r border-[#dce5df] bg-white shadow-xl transition-transform duration-200 dark:border-[#294337] dark:bg-[#0f1b15] lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
        aberto ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-[#dce5df] bg-[#f7faf8] px-5 py-4 dark:border-[#294337] dark:bg-[#101c16]">
        <img
          src="/logo-ometto.svg"
          alt="E.E. José Ometto"
          className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-[0_2px_8px_rgba(16,45,33,0.12)] dark:border-[#294337]"
        />

        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold leading-tight text-[#173d2c] dark:text-emerald-100">
            Notebook Ometto
          </h1>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {admin ? "Painel Administrativo" : "Portal do Professor"}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-[#e5f0e9] lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <MenuItem
          to="/dashboard"
          label="Dashboard"
          icon={House}
          onClick={onClose}
        />

        {!admin && (
          <>
            <p className="px-3 pt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#718078] dark:text-slate-500">
              Solicitações
            </p>

            <MenuItem
              to="/novo-pedido"
              label="Novo Pedido"
              icon={PlusCircle}
              onClick={onClose}
            />

            <MenuItem
              to="/meus-pedidos"
              label="Meus Pedidos"
              icon={History}
              onClick={onClose}
            />

            <MenuItem
              to="/notebooks"
              label="Notebooks disponíveis"
              icon={Laptop}
              onClick={onClose}
            />
          </>
        )}

        {admin && (
          <>
            <p className="px-3 pt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#718078] dark:text-slate-500">
              Administração
            </p>

            <MenuItem
              to="/pedidos"
              label="Todos os Pedidos"
              icon={ClipboardList}
              onClick={onClose}
            />

            <MenuItem
              to="/notebooks"
              label="Notebooks"
              icon={Laptop}
              onClick={onClose}
            />

            <MenuItem
              to="/professores"
              label="Professores"
              icon={Users}
              onClick={onClose}
            />

            <MenuItem
              to="/relatorios"
              label="Relatórios"
              icon={ChartColumn}
              onClick={onClose}
            />

            <MenuItem
              to="/configuracoes"
              label="Configurações"
              icon={Settings}
              onClick={onClose}
            />
          </>
        )}
      </nav>

      <div className="border-t border-[#dce5df] p-3 dark:border-[#294337]">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-700 dark:text-slate-300 dark:hover:bg-red-950/30 dark:hover:text-red-300"
        >
          <LogOut size={18} />
          Sair da conta
        </button>

        <p className="mt-2 px-3 text-xs text-slate-400">
          E.E. José Ometto · v1.1.0
        </p>
      </div>
    </aside>
  );
}