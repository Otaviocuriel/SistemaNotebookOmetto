import { useEffect, useState, type FormEvent } from "react";
import { Laptop } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Modal from "../../components/ui/Modal";
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
  const [editando, setEditando] = useState<Estoque | null>(null);
  const [total, setTotal] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    try {
      const { data } = await api.get<Estoque[]>("/notebooks");
      setItens(data);
      setErro("");
    } catch (error) { setErro(mensagemErro(error)); }
  }
  useEffect(() => {
    api.get<Estoque[]>("/notebooks")
      .then(({ data }) => setItens(data))
      .catch((error) => setErro(mensagemErro(error)));
  }, []);

  function abrirEdicao(item: Estoque) {
    setEditando(item);
    setTotal(String(item.total));
    setErro("");
  }

  async function salvarEdicao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editando) return;
    const novoTotal = Number(total);
    if (!Number.isInteger(novoTotal) || novoTotal < 0) {
      setErro("Informe um número inteiro válido.");
      return;
    }

    setSalvando(true);
    try {
      await api.put(`/notebooks/${editando.categoria}`, { total: novoTotal });
      await carregar();
      setEditando(null);
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div><h1 className="text-3xl font-bold">Notebooks</h1>
          <p className="text-slate-500 mt-1">Disponibilidade atual por categoria.</p></div>
        {erro && <p className="rounded-lg bg-red-50 p-3 text-red-700">{erro}</p>}
        <div className="grid md:grid-cols-2 gap-6">
          {itens.map((item) => (
            <div key={item.id} className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
              <div className="flex justify-between gap-3"><h2 className="text-xl font-bold sm:text-2xl">
                {item.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais"}
              </h2><Laptop size={40} className="text-blue-600" /></div>
              <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3 sm:mt-8">
                <div className="bg-slate-100 rounded-xl p-4"><p>Total</p><strong className="text-3xl">{item.total}</strong></div>
                <div className="bg-green-100 text-green-700 rounded-xl p-4"><p>Disponíveis</p><strong className="text-3xl">{item.disponivel}</strong></div>
                <div className="bg-orange-100 text-orange-700 rounded-xl p-4"><p>Em uso</p><strong className="text-3xl">{item.emUso}</strong></div>
              </div>
              {usuario?.tipo === "ADMIN" && (
                <button
                  type="button"
                  onClick={() => abrirEdicao(item)}
                  className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Editar total
                </button>
              )}
            </div>
          ))}
          {!itens.length && <p className="text-slate-500">O estoque ainda não foi cadastrado pelo administrador.</p>}
        </div>

        <Modal
          isOpen={Boolean(editando)}
          title={`Editar ${editando?.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais"}`}
          onClose={() => !salvando && setEditando(null)}
        >
          <form onSubmit={salvarEdicao} className="space-y-5">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                Informe o total de notebooks dessa categoria. A quantidade disponível será calculada automaticamente considerando os equipamentos em uso.
              </p>
            </div>

            <div>
              <label htmlFor="total-notebooks" className="mb-2 block text-sm font-semibold text-slate-700">
                Quantidade total
              </label>
              <input
                id="total-notebooks"
                type="number"
                min={editando?.emUso ?? 0}
                step="1"
                required
                autoFocus
                value={total}
                onChange={(event) => setTotal(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <p className="mt-2 text-sm text-slate-500">
                Atualmente em uso: {editando?.emUso ?? 0}
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() => setEditando(null)}
                disabled={salvando}
                className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {salvando ? "Salvando..." : "Salvar total"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}

