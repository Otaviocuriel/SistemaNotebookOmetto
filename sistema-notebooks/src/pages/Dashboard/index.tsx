import AdminLayout from "../../layouts/AdminLayout";
import Card from "../../components/ui/Card";
import { Laptop, ClipboardList } from "lucide-react";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card
            title="Notebooks Iniciais"
            value="32"
            icon={<Laptop size={30} />}
            color="bg-green-600"
          />

          <Card
            title="Notebooks Finais"
            value="28"
            icon={<Laptop size={30} />}
            color="bg-blue-600"
          />

          <Card
            title="Pedidos Pendentes"
            value="5"
            icon={<ClipboardList size={30} />}
            color="bg-orange-500"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Últimos Pedidos</h2>
          </div>

          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4">Professor</th>
                <th className="text-left p-4">Sala</th>
                <th className="text-left p-4">Quantidade</th>
                <th className="text-left p-4">Categoria</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td className="p-4">João Silva</td>
                <td className="p-4">7º A</td>
                <td className="p-4">20</td>
                <td className="p-4">Finais</td>
                <td className="p-4 text-green-600 font-semibold">
                  Entregue
                </td>
              </tr>

              <tr className="border-t">
                <td className="p-4">Maria Souza</td>
                <td className="p-4">4º C</td>
                <td className="p-4">18</td>
                <td className="p-4">Iniciais</td>
                <td className="p-4 text-orange-500 font-semibold">
                  Pendente
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}