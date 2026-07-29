import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import UserProfile from "./UserProfile";
import ThemeToggle from "../ui/ThemeToggle";
import { useSettings } from "../../context/SettingsContext";

const titulos: Record<string, string> = {
  "/dashboard": "Visão geral",
  "/pedidos": "Pedidos",
  "/novo-pedido": "Novo pedido",
  "/meus-pedidos": "Meus pedidos",
  "/notebooks": "Notebooks",
  "/professores": "Professores",
  "/relatorios": "Relatórios",
  "/configuracoes": "Configurações",
};

export default function Header({ onMenu }: { onMenu: () => void }) {
  const location = useLocation();
  const { mostrarAvisos } = useSettings();
  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:h-[72px] sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Abrir menu"
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu size={24} />
      </button>

      <div className="hidden min-w-0 sm:block">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Sistema Notebook Ometto
        </p>
        <h2 className="truncate text-lg font-semibold text-slate-800">
          {titulos[location.pathname] ?? "Painel"}
        </h2>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <ThemeToggle />

        {mostrarAvisos && (
          <div
            className="relative hidden rounded-lg border border-slate-200 p-2 text-slate-500 sm:block"
            title="Avisos por e-mail ativos"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
        )}

        <UserProfile />
      </div>
    </header>
  );
}

