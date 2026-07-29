import { useEffect, useState, type FormEvent } from "react";
import { AlertTriangle, Check, Clock3, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Modal from "../../components/ui/Modal";
import { api, mensagemErro } from "../../services/api";

interface ProfessorApi {
  id: number;
  categoria: "INICIAIS" | "FINAIS";
  usuario: { id: number; nome: string; email: string; createdAt: string };
}

export default function Professores() {
  const [professores, setProfessores] = useState<ProfessorApi[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<ProfessorApi[]>([]);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState<ProfessorApi | null>(null);
  const [excluindo, setExcluindo] = useState<ProfessorApi | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [processandoId, setProcessandoId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    categoria: "INICIAIS" as "INICIAIS" | "FINAIS",
  });

  async function carregar() {
    try {
      const [professoresResposta, solicitacoesResposta] = await Promise.all([
        api.get<ProfessorApi[]>("/usuarios/professores"),
        api.get<ProfessorApi[]>("/usuarios/solicitacoes"),
      ]);
      setProfessores(professoresResposta.data);
      setSolicitacoes(solicitacoesResposta.data);
      setErro("");
    } catch (error) {
      setErro(mensagemErro(error));
    }
  }

  useEffect(() => {
    Promise.all([
      api.get<ProfessorApi[]>("/usuarios/professores"),
      api.get<ProfessorApi[]>("/usuarios/solicitacoes"),
    ])
      .then(([professoresResposta, solicitacoesResposta]) => {
        setProfessores(professoresResposta.data);
        setSolicitacoes(solicitacoesResposta.data);
      })
      .catch((error) => setErro(mensagemErro(error)));
  }, []);

  async function aprovar(professor: ProfessorApi) {
    setProcessandoId(professor.id);
    setErro("");
    try {
      await api.patch(`/usuarios/solicitacoes/${professor.id}/aprovar`);
      await carregar();
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setProcessandoId(null);
    }
  }

  async function recusar(professor: ProfessorApi) {
    if (!window.confirm(`Recusar o cadastro de ${professor.usuario.nome}?`)) return;
    setProcessandoId(professor.id);
    setErro("");
    try {
      await api.delete(`/usuarios/solicitacoes/${professor.id}`);
      await carregar();
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setProcessandoId(null);
    }
  }

  function abrirEdicao(professor: ProfessorApi) {
    setForm({
      nome: professor.usuario.nome,
      email: professor.usuario.email,
      categoria: professor.categoria,
    });
    setErro("");
    setEditando(professor);
  }

  async function salvarEdicao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editando) return;
    setSalvando(true);
    try {
      await api.put(`/usuarios/professores/${editando.id}`, form);
      await carregar();
      setEditando(null);
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!excluindo) return;
    setSalvando(true);
    try {
      await api.delete(`/usuarios/professores/${excluindo.id}`);
      await carregar();
      setExcluindo(null);
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Professores</h1>
          <p className="text-slate-500">Professores cadastrados no banco de dados.</p>
        </div>
        {erro && <p className="rounded-lg bg-red-50 p-3 text-red-700">{erro}</p>}

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock3 className="text-amber-500" size={22} />
            <h2 className="text-xl font-bold">Solicitações pendentes</h2>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
              {solicitacoes.length}
            </span>
          </div>

          {solicitacoes.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {solicitacoes.map((professor) => (
                <article key={professor.id} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-lg font-bold">{professor.usuario.nome}</h3>
                      <p className="text-sm text-slate-500">{professor.usuario.email}</p>
                      <p className="mt-2 text-sm font-medium">
                        {professor.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={processandoId === professor.id}
                        onClick={() => aprovar(professor)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check size={18} /> Aprovar
                      </button>
                      <button
                        type="button"
                        disabled={processandoId === professor.id}
                        onClick={() => recusar(professor)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <X size={18} /> Recusar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border bg-white p-5 text-sm text-slate-500">
              Nenhum cadastro aguardando aprovação.
            </div>
          )}
        </section>

        <h2 className="text-xl font-bold">Professores aprovados</h2>
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-100"><tr>
              {["Nome", "E-mail", "Categoria", "Cadastro", "Ações"].map((x) => <th key={x} className="p-4 text-left">{x}</th>)}
            </tr></thead>
            <tbody>
              {professores.map((professor) => <tr key={professor.id} className="border-t">
                <td className="p-4 font-medium">{professor.usuario.nome}</td>
                <td className="p-4">{professor.usuario.email}</td>
                <td className="p-4">{professor.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais"}</td>
                <td className="p-4">{new Date(professor.usuario.createdAt).toLocaleDateString("pt-BR")}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => abrirEdicao(professor)}
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setErro("");
                        setExcluindo(professor);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>)}
              {!professores.length && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum professor cadastrado.</td></tr>}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={Boolean(editando)}
          title="Editar professor"
          onClose={() => !salvando && setEditando(null)}
        >
          <form className="space-y-5" onSubmit={salvarEdicao}>
            <div>
              <label htmlFor="professor-nome" className="mb-2 block text-sm font-semibold text-slate-700">
                Nome
              </label>
              <input
                id="professor-nome"
                value={form.nome}
                onChange={(event) => setForm({ ...form, nome: event.target.value })}
                required
                minLength={3}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="professor-email" className="mb-2 block text-sm font-semibold text-slate-700">
                E-mail
              </label>
              <input
                id="professor-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="professor-categoria" className="mb-2 block text-sm font-semibold text-slate-700">
                Categoria
              </label>
              <select
                id="professor-categoria"
                value={form.categoria}
                onChange={(event) => setForm({
                  ...form,
                  categoria: event.target.value as "INICIAIS" | "FINAIS",
                })}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="INICIAIS">Anos Iniciais</option>
                <option value="FINAIS">Anos Finais</option>
              </select>
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
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={Boolean(excluindo)}
          title="Excluir professor"
          onClose={() => !salvando && setExcluindo(null)}
        >
          <div className="space-y-5">
            <div className="flex gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="mt-0.5 rounded-full bg-red-100 p-2 text-red-600">
                <AlertTriangle size={22} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Tem certeza que deseja excluir {excluindo?.usuario.nome}?
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  A conta e os pedidos finalizados desse professor serão apagados. Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setExcluindo(null)}
                disabled={salvando}
                className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarExclusao}
                disabled={salvando}
                className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {salvando ? "Excluindo..." : "Excluir professor"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}

