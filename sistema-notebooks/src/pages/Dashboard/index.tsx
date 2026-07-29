import { useEffect, useState } from "react";
import { ClipboardList, Laptop } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

interface Estoque { categoria: "INICIAIS" | "FINAIS"; disponivel: number; }
interface Pedido { status: "PENDENTE" | "EM_USO" | "FINALIZADO"; }

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

  const iniciais = estoque.find((item) => item.categoria === "INICIAIS")?.disponivel ?? 0;
  const finais = estoque.find((item) => item.categoria === "FINAIS")?.disponivel ?? 0;
  const pendentes = pedidos.filter((pedido) => pedido.status === "PENDENTE").length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Olá, {usuario?.nome}</h1>
          <p className="text-slate-500">
            {usuario?.tipo === "ADMIN" ? "Visão geral da escola" : "Consulte a disponibilidade e acompanhe seus pedidos"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card title="Disponíveis — Iniciais" value={iniciais} icon={<Laptop size={30} />} color="bg-green-600" />
          <Card title="Disponíveis — Finais" value={finais} icon={<Laptop size={30} />} color="bg-blue-600" />
          <Card title={usuario?.tipo === "ADMIN" ? "Pedidos pendentes" : "Meus pedidos pendentes"}
            value={pendentes} icon={<ClipboardList size={30} />} color="bg-orange-500" />
        </div>
      </div>
    </AdminLayout>
  );
}
