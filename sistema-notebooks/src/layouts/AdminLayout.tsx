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
   <div className="flex min-h-screen bg-[#f3f6f4] dark:bg-[#111827]"> 
      <Sidebar
        aberto={menuAberto}
        onClose={() => setMenuAberto(false)}
        onLogout={sair}
      />
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
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}


