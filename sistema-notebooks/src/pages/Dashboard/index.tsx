import { useEffect, useState } from "react";
import { ArrowRight, ClipboardList, Laptop } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

interface Estoque {
  categoria: "INICIAIS" | "FINAIS";
  disponivel: number;
}

interface Pedido {
  status: "PENDENTE" | "EM_USO" | "RETIRADA_SOLICITADA" | "FINALIZADO";
}

export default function Dashboard() {
  const { usuario } = useAuth();
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    Promise.all([api.get<Estoque[]>("/notebooks"), api.get<Pedido[]>("/pedidos")])
      .then(([notebooks, requests]) => {
        setEstoque(notebooks.data);
        setPedidos(requests.data);
      })
      .catch(() => undefined);
  }, []);

  const iniciais =
    estoque.find((item) => item.categoria === "INICIAIS")?.disponivel ?? 0;
  const finais =
    estoque.find((item) => item.categoria === "FINAIS")?.disponivel ?? 0;
  const pendentes = pedidos.filter((pedido) => pedido.status === "PENDENTE").length;
  const admin = usuario?.tipo === "ADMIN";

  return (
    <AdminLayout>
      <div className="space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
              {admin ? "Painel administrativo" : "Portal do professor"}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Olá, {usuario?.nome}
            </h1>
            <p className="mt-2 text-slate-500">
              {admin
                ? "Acompanhe o estoque e as solicitações da escola."
                : "Consulte a disponibilidade e acompanhe seus pedidos."}
            </p>
          </div>
          <Link
            to={admin ? "/pedidos" : "/novo-pedido"}
            className="primary-button w-full sm:w-auto"
          >
            {admin ? "Ver pedidos" : "Fazer novo pedido"}
            <ArrowRight size={17} />
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card
            title="Disponíveis — Anos Iniciais"
            value={iniciais}
            icon={<Laptop size={26} />}
            color="bg-emerald-700"
          />
          <Card
            title="Disponíveis — Anos Finais"
            value={finais}
            icon={<Laptop size={26} />}
            color="bg-slate-700"
          />
          <Card
            title={admin ? "Pedidos pendentes" : "Meus pedidos pendentes"}
            value={pendentes}
            icon={<ClipboardList size={26} />}
            color="bg-amber-600"
          />
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="settings-icon"><Laptop size={21} /></div>
            <div>
              <h2 className="font-bold text-slate-800">
                Estoque atualizado em tempo real
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                As quantidades disponíveis são recalculadas automaticamente
                quando um pedido é entregue ou quando os notebooks retornam.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

