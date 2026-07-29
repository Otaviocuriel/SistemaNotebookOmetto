import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { api, mensagemErro } from "../../services/api";

interface Pedido {
  id: number; sala: string; quantidade: number;
  status: "PENDENTE" | "EM_USO" | "FINALIZADO"; createdAt: string;
}
const labels = { PENDENTE: "Pendente", EM_USO: "Em uso", FINALIZADO: "Finalizado" };

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [erro, setErro] = useState("");
  useEffect(() => {
    api.get<Pedido[]>("/pedidos").then(({ data }) => setPedidos(data))
      .catch((error) => setErro(mensagemErro(error)));
  }, []);
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Meus Pedidos</h1>
        {erro && <p className="rounded-lg bg-red-50 p-3 text-red-700">{erro}</p>}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100"><tr>
              {["Data", "Sala", "Quantidade", "Status"].map((x) => <th key={x} className="text-left p-4">{x}</th>)}
            </tr></thead>
            <tbody>
              {pedidos.map((pedido) => <tr key={pedido.id} className="border-t">
                <td className="p-4">{new Date(pedido.createdAt).toLocaleString("pt-BR")}</td>
                <td className="p-4">{pedido.sala}</td><td className="p-4">{pedido.quantidade}</td>
                <td className="p-4">{labels[pedido.status]}</td>
              </tr>)}
              {!pedidos.length && <tr><td colSpan={4} className="p-8 text-center text-slate-500">Você ainda não fez pedidos.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
