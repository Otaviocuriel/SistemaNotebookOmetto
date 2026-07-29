import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  function sair() {
    logout();
    navigate("/login", { replace: true });
  }
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar aberto={menuAberto} onClose={() => setMenuAberto(false)} />
      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuAberto(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenu={() => setMenuAberto(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-5 flex justify-end sm:mb-6">
            <button onClick={sair} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Sair
            </button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

