import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { api, mensagemErro } from "../../services/api";

interface PedidoApi {
  id: number;
  sala: string;
  quantidade: number;
  status: "PENDENTE" | "EM_USO" | "FINALIZADO";
  createdAt: string;
  professor: {
    categoria: "INICIAIS" | "FINAIS";
    usuario: { nome: string; email: string };
  };
}

const statusLabel = { PENDENTE: "Pendente", EM_USO: "Em uso", FINALIZADO: "Finalizado" };

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<PedidoApi[]>([]);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      const { data } = await api.get<PedidoApi[]>("/pedidos");
      setPedidos(data);
    } catch (error) {
      setErro(mensagemErro(error));
    }
  }

  useEffect(() => {
    api.get<PedidoApi[]>("/pedidos")
      .then(({ data }) => setPedidos(data))
      .catch((error) => setErro(mensagemErro(error)));
  }, []);

  async function alterar(id: number, acao: "entregar" | "receber") {
    setErro("");
    try {
      await api.patch(`/pedidos/${id}/${acao}`);
      await carregar();
    } catch (error) {
      setErro(mensagemErro(error));
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-slate-500">Controle de entrega e devolução dos notebooks.</p></div>
        {erro && <p className="rounded-lg bg-red-50 p-3 text-red-700">{erro}</p>}
        <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-100"><tr>
              {["Professor", "Sala", "Quantidade", "Categoria", "Status", "Ação"].map((x) =>
                <th key={x} className="p-4 text-left">{x}</th>)}
            </tr></thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-t">
                  <td className="p-4">{pedido.professor.usuario.nome}</td>
                  <td className="p-4">{pedido.sala}</td>
                  <td className="p-4">{pedido.quantidade}</td>
                  <td className="p-4">{pedido.professor.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais"}</td>
                  <td className="p-4">{statusLabel[pedido.status]}</td>
                  <td className="p-4">
                    {pedido.status === "PENDENTE" && <button onClick={() => alterar(pedido.id, "entregar")} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Entregar</button>}
                    {pedido.status === "EM_USO" && <button onClick={() => alterar(pedido.id, "receber")} className="bg-green-600 text-white px-4 py-2 rounded-lg">Receber</button>}
                    {pedido.status === "FINALIZADO" && <span className="text-slate-400">Concluído</span>}
                  </td>
                </tr>
              ))}
              {!pedidos.length && <tr><td colSpan={6} className="p-8 text-center text-slate-500">Nenhum pedido encontrado.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
