import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { api, mensagemErro } from "../../services/api";

type StatusPedido =
  | "PENDENTE"
  | "EM_USO"
  | "RETIRADA_SOLICITADA"
  | "FINALIZADO";

interface PedidoApi {
  id: number;
  sala: string;
  quantidade: number;
  status: StatusPedido;
  createdAt: string;
  professor: {
    categoria: "INICIAIS" | "FINAIS";
    usuario: { nome: string; email: string };
  };
}

const statusLabel: Record<StatusPedido, string> = {
  PENDENTE: "Pendente",
  EM_USO: "Em uso",
  RETIRADA_SOLICITADA: "Retirada solicitada",
  FINALIZADO: "Finalizado",
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<PedidoApi[]>([]);
  const [erro, setErro] = useState("");
  const [alterando, setAlterando] = useState<number | null>(null);

  async function carregar() {
    const { data } = await api.get<PedidoApi[]>("/pedidos");
    setPedidos(data);
  }

  useEffect(() => {
    api.get<PedidoApi[]>("/pedidos")
      .then(({ data }) => setPedidos(data))
      .catch((error) => setErro(mensagemErro(error)));
  }, []);

  async function alterar(id: number, acao: "entregar" | "receber") {
    setErro("");
    setAlterando(id);
    try {
      await api.patch(`/pedidos/${id}/${acao}`);
      await carregar();
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setAlterando(null);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-slate-500">
            Controle de entrega e retirada dos notebooks.
          </p>
        </div>

        {erro && <p className="rounded-lg bg-red-50 p-3 text-red-700">{erro}</p>}

        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-100">
              <tr>
                {["Professor", "Sala", "Quantidade", "Categoria", "Status", "Ação"].map(
                  (titulo) => <th key={titulo} className="p-4 text-left">{titulo}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr
                  key={pedido.id}
                  className={`border-t ${
                    pedido.status === "RETIRADA_SOLICITADA" ? "bg-orange-50" : ""
                  }`}
                >
                  <td className="p-4">{pedido.professor.usuario.nome}</td>
                  <td className="p-4">{pedido.sala}</td>
                  <td className="p-4">{pedido.quantidade}</td>
                  <td className="p-4">
                    {pedido.professor.categoria === "INICIAIS"
                      ? "Anos Iniciais"
                      : "Anos Finais"}
                  </td>
                  <td className="p-4">
                    <span className={
                      pedido.status === "RETIRADA_SOLICITADA"
                        ? "font-semibold text-orange-700"
                        : ""
                    }>
                      {statusLabel[pedido.status]}
                    </span>
                  </td>
                  <td className="p-4">
                    {pedido.status === "PENDENTE" && (
                      <button
                        onClick={() => alterar(pedido.id, "entregar")}
                        disabled={alterando === pedido.id}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        {alterando === pedido.id ? "Salvando..." : "Entregar"}
                      </button>
                    )}
                    {pedido.status === "EM_USO" && (
                      <span className="text-slate-500">Aguardando o professor</span>
                    )}
                    {pedido.status === "RETIRADA_SOLICITADA" && (
                      <button
                        onClick={() => alterar(pedido.id, "receber")}
                        disabled={alterando === pedido.id}
                        className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-60"
                      >
                        {alterando === pedido.id
                          ? "Confirmando..."
                          : "Confirmar retirada"}
                      </button>
                    )}
                    {pedido.status === "FINALIZADO" && (
                      <span className="text-slate-400">Concluído</span>
                    )}
                  </td>
                </tr>
              ))}
              {!pedidos.length && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

