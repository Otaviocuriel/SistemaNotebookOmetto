import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Laptop,
  PackageCheck,
  RotateCcw,
  Users,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { api, mensagemErro } from "../../services/api";

type StatusPedido =
  | "PENDENTE"
  | "EM_USO"
  | "RETIRADA_SOLICITADA"
  | "FINALIZADO";

interface PedidoApi {
  id: number;
  quantidade: number;
  status: StatusPedido;
  createdAt: string;
  professor: {
    categoria: "INICIAIS" | "FINAIS";
  };
}

interface ProfessorApi {
  id: number;
  categoria: "INICIAIS" | "FINAIS";
}

export default function Relatorios() {
  const [pedidos, setPedidos] = useState<PedidoApi[]>([]);
  const [professores, setProfessores] = useState<ProfessorApi[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<PedidoApi[]>("/pedidos"),
      api.get<ProfessorApi[]>("/usuarios/professores"),
    ])
      .then(([pedidosResposta, professoresResposta]) => {
        setPedidos(pedidosResposta.data);
        setProfessores(professoresResposta.data);
      })
      .catch((error) => setErro(mensagemErro(error)))
      .finally(() => setCarregando(false));
  }, []);

  const dados = useMemo(() => {
    const quantidadeSolicitada = pedidos.reduce(
      (total, pedido) => total + pedido.quantidade,
      0
    );

    const pendentes = pedidos.filter(
      (pedido) => pedido.status === "PENDENTE"
    ).length;

    const emUso = pedidos.filter(
      (pedido) => pedido.status === "EM_USO"
    ).length;

    const retiradaSolicitada = pedidos.filter(
      (pedido) => pedido.status === "RETIRADA_SOLICITADA"
    ).length;

    const finalizados = pedidos.filter(
      (pedido) => pedido.status === "FINALIZADO"
    ).length;

    const iniciais = pedidos.filter(
      (pedido) => pedido.professor.categoria === "INICIAIS"
    );

    const finais = pedidos.filter(
      (pedido) => pedido.professor.categoria === "FINAIS"
    );

    const quantidadeIniciais = iniciais.reduce(
      (total, pedido) => total + pedido.quantidade,
      0
    );

    const quantidadeFinais = finais.reduce(
      (total, pedido) => total + pedido.quantidade,
      0
    );

    const percentualFinalizado =
      pedidos.length > 0
        ? Math.round((finalizados / pedidos.length) * 100)
        : 0;

    return {
      quantidadeSolicitada,
      pendentes,
      emUso,
      retiradaSolicitada,
      finalizados,
      pedidosIniciais: iniciais.length,
      pedidosFinais: finais.length,
      quantidadeIniciais,
      quantidadeFinais,
      percentualFinalizado,
    };
  }, [pedidos]);

  const maiorQuantidade = Math.max(
    dados.quantidadeIniciais,
    dados.quantidadeFinais,
    1
  );

  if (carregando) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#dce5df] border-t-[#1f513a]" />

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Carregando relatórios...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-[1500px] space-y-7">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#347b58] dark:text-emerald-400">
            Indicadores do sistema
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Relatórios
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Acompanhe a utilização dos notebooks e o andamento dos pedidos.
          </p>
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

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Indicador
            titulo="Pedidos realizados"
            valor={pedidos.length}
            descricao="Solicitações registradas"
            icone={<BarChart3 size={24} />}
            cor="verde"
          />

          <Indicador
            titulo="Notebooks solicitados"
            valor={dados.quantidadeSolicitada}
            descricao="Soma de todos os pedidos"
            icone={<Laptop size={24} />}
            cor="azul"
          />

          <Indicador
            titulo="Professores"
            valor={professores.length}
            descricao="Cadastros aprovados"
            icone={<Users size={24} />}
            cor="dourado"
          />

          <Indicador
            titulo="Pedidos finalizados"
            valor={`${dados.percentualFinalizado}%`}
            descricao={`${dados.finalizados} pedidos concluídos`}
            icone={<CheckCircle2 size={24} />}
            cor="esmeralda"
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div className="rounded-xl bg-[#e5f0e9] p-2.5 text-[#1f513a] dark:bg-emerald-950/50 dark:text-emerald-300">
                <BarChart3 size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Utilização por categoria
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Quantidade de notebooks solicitados em cada categoria.
                </p>
              </div>
            </div>

            <div className="space-y-7 p-5 sm:p-6">
              <BarraCategoria
                titulo="Anos Iniciais"
                pedidos={dados.pedidosIniciais}
                quantidade={dados.quantidadeIniciais}
                percentual={
                  (dados.quantidadeIniciais / maiorQuantidade) * 100
                }
                cor="bg-[#347b58]"
              />

              <BarraCategoria
                titulo="Anos Finais"
                pedidos={dados.pedidosFinais}
                quantidade={dados.quantidadeFinais}
                percentual={(dados.quantidadeFinais / maiorQuantidade) * 100}
                cor="bg-[#9a7430]"
              />
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                <PackageCheck size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Situação dos pedidos
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Distribuição por status atual.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              <LinhaStatus
                titulo="Pendentes"
                valor={dados.pendentes}
                icone={<Clock3 size={19} />}
                classes="bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
              />

              <LinhaStatus
                titulo="Em uso"
                valor={dados.emUso}
                icone={<Laptop size={19} />}
                classes="bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
              />

              <LinhaStatus
                titulo="Retirada solicitada"
                valor={dados.retiradaSolicitada}
                icone={<RotateCcw size={19} />}
                classes="bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300"
              />

              <LinhaStatus
                titulo="Finalizados"
                valor={dados.finalizados}
                icone={<CheckCircle2 size={19} />}
                classes="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
              />
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-[#c7d9cd] bg-[#f2f7f4] p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-3 text-[#1f513a] shadow-sm dark:bg-slate-800 dark:text-emerald-300">
                <GraduationCap size={24} />
              </div>

              <div>
                <p className="text-sm font-medium text-[#347b58] dark:text-emerald-400">
                  Anos Iniciais
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {dados.pedidosIniciais} pedidos
                </p>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {dados.quantidadeIniciais} notebooks solicitados
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#e4d5b5] bg-[#faf7ef] p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-3 text-[#9a7430] shadow-sm dark:bg-slate-800 dark:text-amber-300">
                <GraduationCap size={24} />
              </div>

              <div>
                <p className="text-sm font-medium text-[#9a7430] dark:text-amber-400">
                  Anos Finais
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {dados.pedidosFinais} pedidos
                </p>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {dados.quantidadeFinais} notebooks solicitados
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </AdminLayout>
  );
}

type CorIndicador = "verde" | "azul" | "dourado" | "esmeralda";

interface IndicadorProps {
  titulo: string;
  valor: number | string;
  descricao: string;
  icone: ReactNode;
  cor: CorIndicador;
}

function Indicador({
  titulo,
  valor,
  descricao,
  icone,
  cor,
}: IndicadorProps) {
  const cores: Record<CorIndicador, string> = {
    verde:
      "bg-[#e5f0e9] text-[#1f513a] dark:bg-emerald-950/50 dark:text-emerald-300",
    azul:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    dourado:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    esmeralda:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {titulo}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {valor}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {descricao}
          </p>
        </div>

        <div className={`shrink-0 rounded-xl p-3 ${cores[cor]}`}>
          {icone}
        </div>
      </div>
    </article>
  );
}

interface BarraCategoriaProps {
  titulo: string;
  pedidos: number;
  quantidade: number;
  percentual: number;
  cor: string;
}

function BarraCategoria({
  titulo,
  pedidos,
  quantidade,
  percentual,
  cor,
}: BarraCategoriaProps) {
  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {titulo}
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}
          </p>
        </div>

        <p className="text-right">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {quantidade}
          </span>

          <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
            notebooks
          </span>
        </p>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-all ${cor}`}
          style={{ width: `${Math.max(percentual, quantidade ? 8 : 0)}%` }}
        />
      </div>
    </div>
  );
}

interface LinhaStatusProps {
  titulo: string;
  valor: number;
  icone: ReactNode;
  classes: string;
}

function LinhaStatus({
  titulo,
  valor,
  icone,
  classes,
}: LinhaStatusProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className={`rounded-xl p-2.5 ${classes}`}>{icone}</div>

      <p className="flex-1 font-medium text-slate-700 dark:text-slate-200">
        {titulo}
      </p>

      <span className="text-xl font-bold text-slate-900 dark:text-white">
        {valor}
      </span>
    </div>
  );
}