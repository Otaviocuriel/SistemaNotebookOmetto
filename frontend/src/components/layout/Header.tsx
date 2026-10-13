import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import UserProfile from "./UserProfile";
import ThemeToggle from "../ui/ThemeToggle";

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

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#dce5df] bg-white/95 px-4 backdrop-blur sm:h-20 sm:px-6 lg:px-8 dark:border-[#294337] dark:bg-[#101c16]/95">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Abrir menu"
        className="rounded-lg p-2 text-[#1f513a] hover:bg-[#e5f0e9] dark:text-emerald-200 dark:hover:bg-[#203529] lg:hidden"
      >
        <Menu size={24} />
      </button>

      <div className="hidden min-w-0 sm:block">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#347b58] dark:text-emerald-400">
          E.E. José Ometto
        </p>

        <h2 className="truncate text-lg font-semibold text-slate-800 dark:text-slate-100">
          {titulos[location.pathname] ?? "Painel"}
        </h2>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <ThemeToggle />

        <UserProfile />
      </div>
    </header>
  );
}
