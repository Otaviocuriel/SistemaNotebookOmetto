import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  History,
  Laptop,
  LoaderCircle,
  MapPin,
  PackagePlus,
  RotateCcw,
} from "lucide-react";

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

const statusConfig: Record<
  StatusPedido,
  {
    label: string;
    classes: string;
  }
> = {
  PENDENTE: {
    label: "Pendente",
    classes:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300",
  },
  EM_USO: {
    label: "Em uso",
    classes:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300",
  },
  RETIRADA_SOLICITADA: {
    label: "Retirada solicitada",
    classes:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-300",
  },
  FINALIZADO: {
    label: "Finalizado",
    classes:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
};

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(data));
}

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [erro, setErro] = useState("");
  const [solicitando, setSolicitando] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    const { data } = await api.get<Pedido[]>("/pedidos");
    setPedidos(data);
  }

  useEffect(() => {
    let ativo = true;

    api
      .get<Pedido[]>("/pedidos")
      .then(({ data }) => {
        if (!ativo) return;

        setPedidos(data);
        setErro("");
      })
      .catch((error) => {
        if (!ativo) return;

        setErro(mensagemErro(error));
      })
      .finally(() => {
        if (!ativo) return;

        setCarregando(false);
      });

    return () => {
      ativo = false;
    };
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

  const pendentes = pedidos.filter(
    (pedido) => pedido.status === "PENDENTE"
  ).length;

  const ativos = pedidos.filter(
    (pedido) =>
      pedido.status === "EM_USO" ||
      pedido.status === "RETIRADA_SOLICITADA"
  ).length;

  const finalizados = pedidos.filter(
    (pedido) => pedido.status === "FINALIZADO"
  ).length;

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-[1500px] space-y-7">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#347b58] dark:text-emerald-400">
              Histórico de solicitações
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Meus pedidos
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
              Acompanhe seus pedidos e avise quando os notebooks puderem ser
              retirados.
            </p>
          </div>

          <Link
            to="/novo-pedido"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f513a] px-5 py-3 font-semibold text-white transition hover:bg-[#173d2c]"
          >
            <PackagePlus size={19} />
            Novo pedido
          </Link>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Resumo
            titulo="Aguardando entrega"
            valor={pendentes}
            icone={<Clock3 size={23} />}
            classes="bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
          />

          <Resumo
            titulo="Pedidos ativos"
            valor={ativos}
            icone={<Laptop size={23} />}
            classes="bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
          />

          <Resumo
            titulo="Finalizados"
            valor={finalizados}
            icone={<CheckCircle2 size={23} />}
            classes="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
          />
        </section>

        {erro && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
            <p>{erro}</p>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <div className="rounded-xl bg-[#e5f0e9] p-2.5 text-[#1f513a] dark:bg-emerald-950/50 dark:text-emerald-300">
              <History size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                Histórico de pedidos
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {pedidos.length}{" "}
                {pedidos.length === 1
                  ? "solicitação registrada"
                  : "solicitações registradas"}
              </p>
            </div>
          </div>

          {carregando ? (
            <div className="flex min-h-52 items-center justify-center">
              <div className="text-center">
                <LoaderCircle
                  className="mx-auto animate-spin text-[#347b58] dark:text-emerald-400"
                  size={32}
                />

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Carregando seus pedidos...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Tabela para computador */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-slate-50 dark:bg-slate-900/60">
                    <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="px-5 py-4">Data</th>
                      <th className="px-5 py-4">Sala</th>
                      <th className="px-5 py-4">Quantidade</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Ação</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {pedidos.map((pedido) => {
                      const status = statusConfig[pedido.status];

                      return (
                        <tr
                          key={pedido.id}
                          className={
                            pedido.status === "RETIRADA_SOLICITADA"
                              ? "bg-orange-50/60 dark:bg-orange-950/10"
                              : "transition hover:bg-slate-50 dark:hover:bg-slate-700/40"
                          }
                        >
                          <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                            {formatarData(pedido.createdAt)}
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                              <MapPin
                                className="text-[#347b58] dark:text-emerald-400"
                                size={17}
                              />
                              {pedido.sala}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {pedido.quantidade}
                            </span>

                            <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">
                              notebooks
                            </span>
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
                              solicitando={solicitando}
                              solicitarRetirada={solicitarRetirada}
                            />
                          </td>
                        </tr>
                      );
                    })}

                    {!pedidos.length && (
                      <tr>
                        <td colSpan={5} className="px-6 py-14 text-center">
                          <History
                            className="mx-auto text-slate-400"
                            size={36}
                          />

                          <p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">
                            Você ainda não fez pedidos
                          </p>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Crie sua primeira solicitação de notebooks.
                          </p>

                          <Link
                            to="/novo-pedido"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1f513a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#173d2c]"
                          >
                            <PackagePlus size={17} />
                            Fazer pedido
                          </Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Cartões para celular */}
              <div className="divide-y divide-slate-200 md:hidden dark:divide-slate-700">
                {pedidos.map((pedido) => {
                  const status = statusConfig[pedido.status];

                  return (
                    <article key={pedido.id} className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatarData(pedido.createdAt)}
                          </p>

                          <p className="mt-2 flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                            <MapPin
                              className="text-[#347b58] dark:text-emerald-400"
                              size={17}
                            />
                            Sala {pedido.sala}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.classes}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Quantidade solicitada
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                          {pedido.quantidade} notebooks
                        </p>
                      </div>

                      <AcaoPedido
                        pedido={pedido}
                        solicitando={solicitando}
                        solicitarRetirada={solicitarRetirada}
                        mobile
                      />
                    </article>
                  );
                })}

                {!pedidos.length && (
                  <div className="px-6 py-14 text-center">
                    <History
                      className="mx-auto text-slate-400"
                      size={36}
                    />

                    <p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">
                      Você ainda não fez pedidos
                    </p>

                    <Link
                      to="/novo-pedido"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1f513a] px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <PackagePlus size={17} />
                      Fazer pedido
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

interface ResumoProps {
  titulo: string;
  valor: number;
  icone: ReactNode;
  classes: string;
}

function Resumo({
  titulo,
  valor,
  icone,
  classes,
}: ResumoProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {titulo}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {valor}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${classes}`}>{icone}</div>
      </div>
    </article>
  );
}

interface AcaoPedidoProps {
  pedido: Pedido;
  solicitando: number | null;
  solicitarRetirada: (id: number) => Promise<void>;
  mobile?: boolean;
}

function AcaoPedido({
  pedido,
  solicitando,
  solicitarRetirada,
  mobile = false,
}: AcaoPedidoProps) {
  const processando = solicitando === pedido.id;
  const largura = mobile ? "w-full justify-center" : "";

  if (pedido.status === "EM_USO") {
    return (
      <button
        type="button"
        onClick={() => solicitarRetirada(pedido.id)}
        disabled={processando}
        className={`inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 ${largura}`}
      >
        {processando ? (
          <LoaderCircle className="animate-spin" size={17} />
        ) : (
          <RotateCcw size={17} />
        )}

        {processando ? "Solicitando..." : "Solicitar retirada"}
      </button>
    );
  }

  if (pedido.status === "RETIRADA_SOLICITADA") {
    return (
      <span
        className={`inline-flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 ${largura}`}
      >
        <Clock3 size={17} />
        Aguardando administrador
      </span>
    );
  }

  if (pedido.status === "PENDENTE") {
    return (
      <span
        className={`inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 ${largura}`}
      >
        <Clock3 size={17} />
        Aguardando entrega
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 ${largura}`}
    >
      <CheckCircle2 size={17} />
      Concluído
    </span>
  );
}