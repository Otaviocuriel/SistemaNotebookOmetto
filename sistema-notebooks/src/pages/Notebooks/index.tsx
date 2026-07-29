import { useEffect, useState } from "react";
import { Laptop } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { api, mensagemErro } from "../../services/api";

interface Estoque {
  id: number;
  categoria: "INICIAIS" | "FINAIS";
  total: number;
  disponivel: number;
  emUso: number;
}

export default function Notebooks() {
  const { usuario } = useAuth();
  const [itens, setItens] = useState<Estoque[]>([]);
  const [erro, setErro] = useState("");
  async function carregar() {
    try {
      const { data } = await api.get<Estoque[]>("/notebooks");
      setItens(data);
    } catch (error) { setErro(mensagemErro(error)); }
  }
  useEffect(() => {
    api.get<Estoque[]>("/notebooks")
      .then(({ data }) => setItens(data))
      .catch((error) => setErro(mensagemErro(error)));
  }, []);

  async function editar(item: Estoque) {
    const valor = window.prompt("Novo total de notebooks:", String(item.total));
    if (valor === null) return;
    const total = Number(valor);
    if (!Number.isInteger(total) || total < 0) return setErro("Informe um número inteiro válido.");
    try {
      await api.put(`/notebooks/${item.categoria}`, { total });
      await carregar();
    } catch (error) { setErro(mensagemErro(error)); }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div><h1 className="text-3xl font-bold">Notebooks</h1>
          <p className="text-slate-500 mt-1">Disponibilidade atual por categoria.</p></div>
        {erro && <p className="rounded-lg bg-red-50 p-3 text-red-700">{erro}</p>}
        <div className="grid md:grid-cols-2 gap-6">
          {itens.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex justify-between"><h2 className="text-2xl font-bold">
                {item.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais"}
              </h2><Laptop size={40} className="text-blue-600" /></div>
              <div className="grid grid-cols-3 gap-3 mt-8">
                <div className="bg-slate-100 rounded-xl p-4"><p>Total</p><strong className="text-3xl">{item.total}</strong></div>
                <div className="bg-green-100 text-green-700 rounded-xl p-4"><p>Disponíveis</p><strong className="text-3xl">{item.disponivel}</strong></div>
                <div className="bg-orange-100 text-orange-700 rounded-xl p-4"><p>Em uso</p><strong className="text-3xl">{item.emUso}</strong></div>
              </div>
              {usuario?.tipo === "ADMIN" && <button onClick={() => editar(item)} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl">Editar total</button>}
            </div>
          ))}
          {!itens.length && <p className="text-slate-500">O estoque ainda não foi cadastrado pelo administrador.</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
