import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Laptop,
  MapPin,
  PackageCheck,
  RotateCcw,
  UserRound,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { api, mensagemErro } from "../../services/api";
import { statusPedidoConfig, type Pedido } from "../../types/pedido";

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(data));
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [erro, setErro] = useState("");
  const [alterando, setAlterando] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    const { data } = await api.get<Pedido[]>("/pedidos");
    setPedidos(data);
  }

  useEffect(() => {
    api
      .get<Pedido[]>("/pedidos")
      .then(({ data }) => setPedidos(data))
      .catch((error) => setErro(mensagemErro(error)))
      .finally(() => setCarregando(false));
  }, []);

  async function tentarNovamente() {
    setCarregando(true);
    setErro("");
    try {
      await carregar();
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setCarregando(false);
    }
  }

  async function alterar(id: number, acao: "entregar" | "receber" | "cancelar") {
    if (acao === "cancelar" && !window.confirm("Cancelar este pedido pendente?")) return;
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

  const pendentes = pedidos.filter(
    (pedido) => pedido.status === "PENDENTE"
  ).length;

  const emUso = pedidos.filter(
    (pedido) => pedido.status === "EM_USO"
  ).length;

  const retiradas = pedidos.filter(
    (pedido) => pedido.status === "RETIRADA_SOLICITADA"
  ).length;

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-[1500px] space-y-6">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#347b58] dark:text-emerald-400">
            Controle de empréstimos
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Pedidos
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Acompanhe as solicitações e controle a entrega e a retirada dos
            notebooks.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Pedidos pendentes
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {pendentes}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300">
                <Clock3 size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Em uso
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {emUso}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                <Laptop size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Aguardando retirada
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {retiradas}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300">
                <RotateCcw size={24} />
              </div>
            </div>
          </div>
        </section>

        {erro && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
            <p>{erro} <button type="button" onClick={() => void tentarNovamente()} className="font-bold underline">Tentar novamente</button></p>
          </div>
        )}
        {carregando && <p role="status" className="text-sm text-slate-500">Carregando pedidos...</p>}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <div className="rounded-xl bg-[#e5f0e9] p-2.5 text-[#1f513a] dark:bg-emerald-950/50 dark:text-emerald-300">
              <PackageCheck size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                Solicitações recebidas
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {pedidos.length}{" "}
                {pedidos.length === 1
                  ? "pedido registrado"
                  : "pedidos registrados"}
              </p>
            </div>
          </div>

          {/* Visual para computador */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50 dark:bg-slate-900/60">
                <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-4">Professor</th>
                  <th className="px-5 py-4">Sala</th>
                  <th className="px-5 py-4">Quantidade</th>
                  <th className="px-5 py-4">Categoria</th>
                  <th className="px-5 py-4">Data</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Ação</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {pedidos.map((pedido) => {
                  const status = statusPedidoConfig[pedido.status];

                  return (
                    <tr
                      key={pedido.id}
                      className={
                        pedido.status === "RETIRADA_SOLICITADA"
                          ? "bg-orange-50/60 dark:bg-orange-950/10"
                          : "transition hover:bg-slate-50 dark:hover:bg-slate-700/40"
                      }
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5f0e9] text-[#1f513a] dark:bg-emerald-950/60 dark:text-emerald-300">
                            <UserRound size={19} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {pedido.professor.usuario.nome}
                            </p>

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {pedido.professor.usuario.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                        {pedido.sala}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">
                        {pedido.quantidade}
                      </td>

                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        {pedido.categoria === "INICIAIS"
                          ? "Anos Iniciais"
                          : "Anos Finais"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {formatarData(pedido.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${status.classes}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <AcaoPedido
                          pedido={pedido}
                          alterando={alterando}
                          alterar={alterar}
                        />
                      </td>
                    </tr>
                  );
                })}

                {!carregando && !erro && !pedidos.length && (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center">
                      <CheckCircle2
                        size={36}
                        className="mx-auto text-[#347b58] dark:text-emerald-400"
                      />

                      <p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">
                        Nenhum pedido encontrado
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        As novas solicitações aparecerão aqui.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Visual para celular */}
          <div className="divide-y divide-slate-200 md:hidden dark:divide-slate-700">
            {pedidos.map((pedido) => {
              const status = statusPedidoConfig[pedido.status];

              return (
                <article key={pedido.id} className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5f0e9] text-[#1f513a] dark:bg-emerald-950/60 dark:text-emerald-300">
                        <UserRound size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                          {pedido.professor.usuario.nome}
                        </p>

                        <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                          {pedido.professor.usuario.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.classes}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin size={14} />
                        Sala
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                        {pedido.sala}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Laptop size={14} />
                        Quantidade
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                        {pedido.quantidade}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    <p>
                      {pedido.categoria === "INICIAIS"
                        ? "Anos Iniciais"
                        : "Anos Finais"}
                    </p>

                    <p>{formatarData(pedido.createdAt)}</p>
                  </div>

                  <AcaoPedido
                    pedido={pedido}
                    alterando={alterando}
                    alterar={alterar}
                    mobile
                  />
                </article>
              );
            })}

            {!carregando && !erro && !pedidos.length && (
              <div className="px-6 py-14 text-center">
                <CheckCircle2
                  size={36}
                  className="mx-auto text-[#347b58] dark:text-emerald-400"
                />

                <p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">
                  Nenhum pedido encontrado
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

interface AcaoPedidoProps {
  pedido: Pedido;
  alterando: number | null;
  alterar: (id: number, acao: "entregar" | "receber" | "cancelar") => Promise<void>;
  mobile?: boolean;
}

function AcaoPedido({
  pedido,
  alterando,
  alterar,
  mobile = false,
}: AcaoPedidoProps) {
  const processando = alterando === pedido.id;
  const largura = mobile ? "w-full justify-center" : "";

  if (pedido.status === "PENDENTE") {
    return (
      <div className={`flex flex-wrap gap-2 ${mobile ? "flex-col" : "justify-end"}`}>
        <button
          type="button"
          onClick={() => alterar(pedido.id, "entregar")}
          disabled={processando}
          className={`inline-flex items-center gap-2 rounded-xl bg-[#1f513a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173d2c] disabled:cursor-not-allowed disabled:opacity-60 ${largura}`}
        >
          <PackageCheck size={17} />
          {processando ? "Salvando..." : "Entregar"}
        </button>
        <button
          type="button"
          onClick={() => alterar(pedido.id, "cancelar")}
          disabled={processando}
          className={`rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 ${largura}`}
        >
          Cancelar
        </button>
      </div>
    );
  }

  if (pedido.status === "RETIRADA_SOLICITADA") {
    return (
      <button
        type="button"
        onClick={() => alterar(pedido.id, "receber")}
        disabled={processando}
        className={`inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 ${largura}`}
      >
        <RotateCcw size={17} />
        {processando ? "Confirmando..." : "Confirmar retirada"}
      </button>
    );
  }

  if (pedido.status === "EM_USO") {
    return (
      <span
        className={`inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 ${largura}`}
      >
        <Clock3 size={17} />
        Aguardando professor
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-medium ${pedido.status === "CANCELADO" ? "text-slate-500 dark:text-slate-400" : "text-emerald-700 dark:text-emerald-400"} ${largura}`}
    >
      {pedido.status === "CANCELADO" ? <Clock3 size={17} /> : <CheckCircle2 size={17} />}
      {pedido.status === "CANCELADO" ? "Cancelado" : "Concluído"}
    </span>
  );
}
