import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  function sair() {
    logout();
    navigate("/login", { replace: true });
  }
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex justify-end mb-6">
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
