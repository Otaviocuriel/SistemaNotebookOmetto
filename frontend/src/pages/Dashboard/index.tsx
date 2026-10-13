import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Laptop,
} from "lucide-react";
import { Link } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { api, mensagemErro } from "../../services/api";
import type { NotebookCategoria } from "../../types/notebook";
import type { Pedido } from "../../types/pedido";

export default function Dashboard() {
  const { usuario } = useAuth();

  const [estoque, setEstoque] = useState<NotebookCategoria[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const [notebooks, requests] = await Promise.all([
        api.get<NotebookCategoria[]>("/notebooks"),
        api.get<Pedido[]>("/pedidos"),
      ]);
      setEstoque(notebooks.data);
      setPedidos(requests.data);
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    Promise.all([
      api.get<NotebookCategoria[]>("/notebooks"),
      api.get<Pedido[]>("/pedidos"),
    ])
      .then(([notebooks, requests]) => {
        setEstoque(notebooks.data);
        setPedidos(requests.data);
      })
      .catch((error) => setErro(mensagemErro(error)))
      .finally(() => setCarregando(false));
  }, []);

  const iniciais =
    estoque.find((item) => item.categoria === "INICIAIS")?.solicitavel ?? 0;

  const finais =
    estoque.find((item) => item.categoria === "FINAIS")?.solicitavel ?? 0;

  const pendentes = pedidos.filter(
    (pedido) => pedido.status === "PENDENTE"
  ).length;

  const admin = usuario?.tipo === "ADMIN";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="relative overflow-hidden rounded-[20px] border border-[#dce5df] bg-white p-6 shadow-[0_10px_28px_rgba(16,45,33,0.06)] dark:border-[#294337] dark:bg-[#101c16] sm:p-8">
          <div className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full border-[44px] border-[#e5f0e9]/70 dark:border-[#1b3226]" />

          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#347b58] dark:text-emerald-400">
                {admin ? "Painel administrativo" : "Portal do professor"}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-900 dark:text-white sm:text-4xl">
                Olá, {usuario?.nome}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                {admin
                  ? "Acompanhe o estoque e organize as solicitações de notebooks da escola."
                  : "Consulte a disponibilidade e acompanhe seus pedidos de notebooks."}
              </p>
            </div>

            <Link
              to={admin ? "/pedidos" : "/novo-pedido"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f513a] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_12px_rgba(31,81,58,0.2)] transition hover:bg-[#173d2c] focus:outline-none focus:ring-2 focus:ring-[#347b58] focus:ring-offset-2 sm:w-auto"
            >
              {admin ? "Ver pedidos" : "Fazer novo pedido"}
              <ArrowRight size={17} />
            </Link>
          </div>
        </header>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Resumo geral
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Quantidades disponíveis para novos pedidos, considerando as reservas pendentes.
            </p>
          </div>

          {carregando && (
            <p role="status" className="text-sm text-slate-500">
              Carregando indicadores...
            </p>
          )}
          {erro && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              {erro}{" "}
              <button type="button" onClick={() => void carregar()} className="font-bold underline">
                Tentar novamente
              </button>
            </div>
          )}
          {!carregando && !erro && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card
              title="Disponíveis — Anos Iniciais"
              value={iniciais}
              icon={<Laptop size={24} />}
              tone="brand"
              description="Livres após os pedidos pendentes"
            />

            <Card
              title="Disponíveis — Anos Finais"
              value={finais}
              icon={<Laptop size={24} />}
              tone="forest"
              description="Livres após os pedidos pendentes"
            />

            <Card
              title={admin ? "Pedidos pendentes" : "Meus pedidos pendentes"}
              value={pendentes}
              icon={<ClipboardList size={24} />}
              tone="gold"
              description={
                admin
                  ? "Aguardando atendimento"
                  : "Aguardando confirmação"
              }
            />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#dce5df] bg-white p-5 shadow-[0_5px_18px_rgba(16,45,33,0.04)] dark:border-[#294337] dark:bg-[#101c16] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e5f0e9] text-[#1f513a] dark:bg-[#1b3226] dark:text-emerald-300">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100">
                Estoque atualizado automaticamente
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                A disponibilidade para novos pedidos considera as reservas pendentes,
                as entregas, os cancelamentos e as devoluções.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
