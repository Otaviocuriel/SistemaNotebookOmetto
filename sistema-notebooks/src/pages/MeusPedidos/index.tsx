import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { api, mensagemErro } from "../../services/api";

type StatusPedido =
  | "PENDENTE"
  | "EM_USO"
  | "RETIRADA_SOLICITADA"
  | "FINALIZADO";

interface Pedido {
  id: number;
  sala: string;
  quantidade: number;
  status: StatusPedido;
  createdAt: string;
}

const labels: Record<StatusPedido, string> = {
  PENDENTE: "Pendente",
  EM_USO: "Em uso",
  RETIRADA_SOLICITADA: "Retirada solicitada",
  FINALIZADO: "Finalizado",
};

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [erro, setErro] = useState("");
  const [solicitando, setSolicitando] = useState<number | null>(null);

  async function carregar() {
    const { data } = await api.get<Pedido[]>("/pedidos");
    setPedidos(data);
  }

  useEffect(() => {
    api.get<Pedido[]>("/pedidos")
      .then(({ data }) => setPedidos(data))
      .catch((error) => setErro(mensagemErro(error)));
  }, []);

  async function solicitarRetirada(id: number) {
    setErro("");
    setSolicitando(id);
    try {
      await api.patch(`/pedidos/${id}/solicitar-retirada`);
      await carregar();
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setSolicitando(null);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meus Pedidos</h1>
          <p className="text-slate-500">
            Acompanhe os pedidos e avise quando os notebooks puderem ser retirados.
          </p>
        </div>

        {erro && <p className="rounded-lg bg-red-50 p-3 text-red-700">{erro}</p>}

        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-100">
              <tr>
                {["Data", "Sala", "Quantidade", "Status", "Ação"].map((titulo) => (
                  <th key={titulo} className="p-4 text-left">{titulo}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-t">
                  <td className="p-4">
                    {new Date(pedido.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-4">{pedido.sala}</td>
                  <td className="p-4">{pedido.quantidade}</td>
                  <td className="p-4">
                    <span className={
                      pedido.status === "RETIRADA_SOLICITADA"
                        ? "font-semibold text-orange-700"
                        : ""
                    }>
                      {labels[pedido.status]}
                    </span>
                  </td>
                  <td className="p-4">
                    {pedido.status === "EM_USO" && (
                      <button
                        onClick={() => solicitarRetirada(pedido.id)}
                        disabled={solicitando === pedido.id}
                        className="rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {solicitando === pedido.id
                          ? "Solicitando..."
                          : "Solicitar retirada"}
                      </button>
                    )}
                    {pedido.status === "RETIRADA_SOLICITADA" && (
                      <span className="font-medium text-orange-600">
                        Aguardando o administrador
                      </span>
                    )}
                    {(pedido.status === "PENDENTE" ||
                      pedido.status === "FINALIZADO") && (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!pedidos.length && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Você ainda não fez pedidos.
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

