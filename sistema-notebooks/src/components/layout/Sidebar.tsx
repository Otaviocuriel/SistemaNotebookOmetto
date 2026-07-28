import {
  House,
  ClipboardList,
  Laptop,
  Users,
  ChartColumn,
  Settings,
  PlusCircle,
  History,
} from "lucide-react";

import MenuItem from "./MenuItem";

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col">

      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          Notebook Ometto
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Painel Administrativo
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">

        <MenuItem
          to="/dashboard"
          label="Dashboard"
          icon={House}
        />

        <p className="text-xs font-semibold uppercase text-slate-400 px-3 pt-4">
          Pedidos
        </p>

        <MenuItem
          to="/novo-pedido"
          label="Novo Pedido"
          icon={PlusCircle}
        />

        <MenuItem
          to="/pedidos"
          label="Todos os Pedidos"
          icon={ClipboardList}
        />

        <MenuItem
          to="/meus-pedidos"
          label="Meus Pedidos"
          icon={History}
        />

        <p className="text-xs font-semibold uppercase text-slate-400 px-3 pt-4">
          Administração
        </p>

        <MenuItem
          to="/notebooks"
          label="Notebooks"
          icon={Laptop}
        />

        <MenuItem
          to="/professores"
          label="Professores"
          icon={Users}
        />

        <MenuItem
          to="/relatorios"
          label="Relatórios"
          icon={ChartColumn}
        />

        <MenuItem
          to="/configuracoes"
          label="Configurações"
          icon={Settings}
        />

      </nav>

      <div className="border-t p-4 text-center text-sm text-slate-500">
        Sistema Notebook Ometto
        <br />
        v1.0.0
      </div>

    </aside>
  );
}