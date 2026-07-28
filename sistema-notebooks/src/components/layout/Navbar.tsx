import { Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Bem-vindo ao Sistema Notebook Ometto
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative rounded-lg p-2 hover:bg-slate-100 transition">
          <Bell size={22} />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <User size={20} />
          </div>

          <div>
            <p className="font-semibold">Otávio</p>
            <p className="text-sm text-slate-500">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}