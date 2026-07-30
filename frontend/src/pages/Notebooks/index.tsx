import { useEffect, useState, type FormEvent } from "react";
import {
  Activity,
  Boxes,
  CheckCircle2,
  Laptop,
  Pencil,
} from "lucide-react";

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
    } catch (error) {
      setErro(mensagemErro(error));
    }
  }

  useEffect(() => {
    api
      .get<Estoque[]>("/notebooks")
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
      await api.put(`/notebooks/${editando.categoria}`, {
        total: novoTotal,
      });

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
      <div className="space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#347b58] dark:text-emerald-400">
            Controle de equipamentos
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-900 dark:text-white">
            Notebooks
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Acompanhe o total, a disponibilidade e os equipamentos que estão
            em uso.
          </p>
        </header>

        {erro && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {erro}
          </p>
        )}

        <div className="grid gap-5 xl:grid-cols-2">
          {itens.map((item) => {
            const porcentagem =
              item.total > 0
                ? Math.round((item.disponivel / item.total) * 100)
                : 0;

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-[20px] border border-[#dce5df] bg-white shadow-[0_8px_25px_rgba(16,45,33,0.055)] dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#e3ebe6] bg-[#f7faf8] p-5 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#347b58] dark:text-emerald-400">
                      Categoria
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {item.categoria === "INICIAIS"
                        ? "Anos Iniciais"
                        : "Anos Finais"}
                    </h2>
                  </div>

                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#e5f0e9] text-[#1f513a] dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Laptop size={25} />
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-3">
                    <div className="rounded-xl border border-[#e1e8e3] bg-[#f8faf9] p-4 dark:border-slate-700 dark:bg-slate-950">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Boxes size={17} />
                        <p className="text-sm font-semibold">Total</p>
                      </div>

                      <strong className="mt-2 block text-3xl font-bold text-slate-900 dark:text-white">
                        {item.total}
                      </strong>
                    </div>

                    <div className="rounded-xl border border-[#cfe0d4] bg-[#edf5f0] p-4 dark:border-emerald-900 dark:bg-emerald-950/25">
                      <div className="flex items-center gap-2 text-[#286548] dark:text-emerald-300">
                        <CheckCircle2 size={17} />
                        <p className="text-sm font-semibold">Disponíveis</p>
                      </div>

                      <strong className="mt-2 block text-3xl font-bold text-[#173d2c] dark:text-emerald-100">
                        {item.disponivel}
                      </strong>
                    </div>

                    <div className="rounded-xl border border-[#eadcb9] bg-[#faf5e9] p-4 dark:border-amber-900/70 dark:bg-amber-950/20">
                      <div className="flex items-center gap-2 text-[#8b6828] dark:text-amber-300">
                        <Activity size={17} />
                        <p className="text-sm font-semibold">Em uso</p>
                      </div>

                      <strong className="mt-2 block text-3xl font-bold text-[#6e501d] dark:text-amber-100">
                        {item.emUso}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-xs font-semibold">
                      <span className="text-slate-500 dark:text-slate-400">
                        Disponibilidade
                      </span>

                      <span className="text-[#286548] dark:text-emerald-400">
                        {porcentagem}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#e5ebe7] dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-[#347b58] transition-all"
                        style={{
                          width: `${Math.min(porcentagem, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {usuario?.tipo === "ADMIN" && (
                    <button
                      type="button"
                      onClick={() => abrirEdicao(item)}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#b9cbbf] bg-white py-3 font-bold text-[#1f513a] transition hover:border-[#347b58] hover:bg-[#f2f7f4] dark:border-[#3c5849] dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-[#17271f]"
                    >
                      <Pencil size={17} />
                      Editar quantidade total
                    </button>
                  )}
                </div>
              </article>
            );
          })}

          {!itens.length && (
            <div className="rounded-2xl border border-dashed border-[#b9cbbf] bg-white p-8 text-center text-sm text-slate-500 dark:bg-slate-950 dark:bg-slate-900 dark:text-slate-400">
              O estoque ainda não foi cadastrado pelo administrador.
            </div>
          )}
        </div>

        <Modal
          isOpen={Boolean(editando)}
          title={`Editar ${
            editando?.categoria === "INICIAIS"
              ? "Anos Iniciais"
              : "Anos Finais"
          }`}
          onClose={() => !salvando && setEditando(null)}
        >
          <form onSubmit={salvarEdicao} className="space-y-5">
            <div className="rounded-xl border border-[#cfe0d4] bg-[#edf5f0] p-4 dark:border-emerald-900 dark:bg-emerald-950/25">
              <p className="text-sm leading-6 text-[#286548] dark:text-emerald-300">
                Informe o total de notebooks desta categoria. A quantidade
                disponível será calculada automaticamente considerando os
                equipamentos em uso.
              </p>
            </div>

            <div>
              <label
                htmlFor="total-notebooks"
                className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
              >
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
                className="w-full rounded-xl border border-[#cbd8d0] bg-white px-4 py-3 text-lg outline-none transition focus:border-[#347b58] focus:ring-4 focus:ring-[#347b58]/10 dark:bg-slate-950 dark:bg-slate-950 dark:text-white"
              />

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Atualmente em uso: {editando?.emUso ?? 0}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#e3ebe6] pt-5 dark:border-[#294337] sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setEditando(null)}
                disabled={salvando}
                className="rounded-xl border border-[#cbd8d0] px-5 py-2.5 font-bold text-slate-700 transition hover:bg-[#f2f7f4] disabled:opacity-50 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-[#17271f]"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={salvando}
                className="rounded-xl bg-[#1f513a] px-5 py-2.5 font-bold text-white transition hover:bg-[#173d2c] disabled:opacity-50"
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