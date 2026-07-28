import type { ReactNode } from "react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}


export default function AdminLayout({ children }: Props) {

  const { usuario, logout } = useAuth();


  return (

    <div className="flex min-h-screen bg-slate-100">


      <Sidebar />


      <div className="flex-1 flex flex-col">


        <Header />


        <main className="flex-1 p-8 overflow-auto">


          <div className="flex justify-between items-center mb-6">


            <div>

              <p className="font-semibold text-slate-700">
                Olá, {usuario?.nome}
              </p>

              <p className="text-sm text-slate-500">
                {usuario?.tipo}
              </p>

            </div>



            <button
              onClick={() => {

                logout();

                window.location.href = "/login";

              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >

              Sair

            </button>


          </div>



          {children}


        </main>


      </div>


    </div>

  );

}