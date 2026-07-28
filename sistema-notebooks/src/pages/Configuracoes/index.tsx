import AdminLayout from "../../layouts/AdminLayout";
import {
  UserCog,
  Lock,
  School,
  Bell,
} from "lucide-react";

export default function Configuracoes() {
  return (
    <AdminLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold">
            Configurações
          </h1>

          <p className="text-slate-500 mt-2">
            Gerencie as configurações do sistema.
          </p>
        </div>


        <div className="grid md:grid-cols-2 gap-6">


          <div className="bg-white rounded-2xl border shadow-sm p-6">

            <div className="flex items-center gap-3 mb-4">

              <School
                className="text-blue-600"
                size={28}
              />

              <h2 className="text-xl font-bold">
                Dados da Escola
              </h2>

            </div>


            <div className="space-y-4">

              <div>
                <label className="block mb-2 font-medium">
                  Nome da escola
                </label>

                <input
                  className="w-full border rounded-lg px-4 py-3"
                  value="Escola Ometto"
                  readOnly
                />
              </div>


              <div>
                <label className="block mb-2 font-medium">
                  Responsável pelo sistema
                </label>

                <input
                  className="w-full border rounded-lg px-4 py-3"
                  value="Administrador"
                  readOnly
                />
              </div>

            </div>

          </div>



          <div className="bg-white rounded-2xl border shadow-sm p-6">

            <div className="flex items-center gap-3 mb-4">

              <UserCog
                className="text-blue-600"
                size={28}
              />

              <h2 className="text-xl font-bold">
                Usuários
              </h2>

            </div>


            <p className="text-slate-500 mb-5">
              Gerencie os administradores que possuem acesso ao sistema.
            </p>


            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700">
              Gerenciar usuários
            </button>

          </div>



          <div className="bg-white rounded-2xl border shadow-sm p-6">

            <div className="flex items-center gap-3 mb-4">

              <Lock
                className="text-blue-600"
                size={28}
              />

              <h2 className="text-xl font-bold">
                Segurança
              </h2>

            </div>


            <button className="border px-5 py-3 rounded-lg hover:bg-slate-100">
              Alterar senha
            </button>

          </div>



          <div className="bg-white rounded-2xl border shadow-sm p-6">

            <div className="flex items-center gap-3 mb-4">

              <Bell
                className="text-blue-600"
                size={28}
              />

              <h2 className="text-xl font-bold">
                Notificações
              </h2>

            </div>


            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                className="w-5 h-5"
                defaultChecked
              />

              Receber avisos de novos pedidos

            </label>

          </div>


        </div>

      </div>
    </AdminLayout>
  );
}