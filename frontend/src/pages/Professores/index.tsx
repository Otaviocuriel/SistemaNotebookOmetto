import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  Mail,
  Pencil,
  Trash2,
  UserCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import Modal from "../../components/ui/Modal";
import { api, mensagemErro } from "../../services/api";
import type { Professor } from "../../types/professor";

type ProfessorApi = Professor;

function nomeCategoria(categoria: ProfessorApi["categoria"]) {
  return categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais";
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
}

export default function Professores() {
  const [professores, setProfessores] = useState<ProfessorApi[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<ProfessorApi[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
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
    setCarregando(true);
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
    } finally {
      setCarregando(false);
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
      .catch((error) => setErro(mensagemErro(error)))
      .finally(() => setCarregando(false));
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
    const confirmou = window.confirm(
      `Recusar o cadastro de ${professor.usuario.nome}?`,
    );

    if (!confirmou) return;

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
    setErro("");

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
    setErro("");

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

  async function reativar(professor: ProfessorApi) {
    setProcessandoId(professor.id);
    setErro("");
    try {
      await api.patch(`/usuarios/professores/${professor.id}/reativar`);
      await carregar();
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setProcessandoId(null);
    }
  }

  const professoresAtivos = professores.filter(
    (professor) => professor.usuario.ativo,
  );
  const professoresIniciais = professoresAtivos.filter(
    (professor) => professor.categoria === "INICIAIS",
  ).length;

  const professoresFinais = professoresAtivos.filter(
    (professor) => professor.categoria === "FINAIS",
  ).length;

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-[1500px] space-y-7">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#347b58] dark:text-emerald-400">
            Gestão de usuários
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Professores
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Analise solicitações e gerencie os professores autorizados a usar o
            sistema.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Resumo
            titulo="Professores ativos"
            valor={professoresAtivos.length}
            icone={<Users size={24} />}
            cor="verde"
          />

          <Resumo
            titulo="Anos Iniciais"
            valor={professoresIniciais}
            icone={<GraduationCap size={24} />}
            cor="azul"
          />

          <Resumo
            titulo="Anos Finais"
            valor={professoresFinais}
            icone={<UserCheck size={24} />}
            cor="dourado"
          />
        </section>

        {erro && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
            <p>
              {erro}{" "}
              {!editando && !excluindo && (
                <button type="button" onClick={() => void carregar()} className="font-bold underline">
                  Tentar novamente
                </button>
              )}
            </p>
          </div>
        )}
        {carregando && <p role="status" className="text-sm text-slate-500">Carregando professores...</p>}

        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300">
              <Clock3 size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Solicitações pendentes
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Cadastros que precisam da aprovação de um administrador.
              </p>
            </div>

            <span className="ml-auto rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              {solicitacoes.length}
            </span>
          </div>

          {solicitacoes.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {solicitacoes.map((professor) => {
                const processando = processandoId === professor.id;

                return (
                  <article
                    key={professor.id}
                    className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm dark:border-amber-900/70 dark:bg-slate-800"
                  >
                    <div className="h-1 bg-amber-400" />

                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                          <UserRound size={23} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                            {professor.usuario.nome}
                          </h3>

                          <p className="mt-1 flex items-center gap-2 break-all text-sm text-slate-500 dark:text-slate-400">
                            <Mail className="shrink-0" size={15} />
                            {professor.usuario.email}
                          </p>

                          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                            <GraduationCap size={14} />
                            {nomeCategoria(professor.categoria)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
                        <button
                          type="button"
                          disabled={processando}
                          onClick={() => aprovar(professor)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f513a] px-4 py-2.5 font-semibold text-white transition hover:bg-[#173d2c] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Check size={18} />
                          {processando ? "Processando..." : "Aprovar"}
                        </button>

                        <button
                          type="button"
                          disabled={processando}
                          onClick={() => recusar(professor)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          <X size={18} />
                          Recusar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : !carregando && !erro ? (
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="rounded-full bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Check size={22} />
              </div>

              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Nenhuma solicitação pendente
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Todos os cadastros já foram analisados.
                </p>
              </div>
            </div>
          ) : null}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <div className="rounded-xl bg-[#e5f0e9] p-2.5 text-[#1f513a] dark:bg-emerald-950/50 dark:text-emerald-300">
              <Users size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                Professores cadastrados
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Contas ativas e desativadas, com histórico preservado.
              </p>
            </div>
          </div>

          {/* Tabela para computador */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[850px]">
              <thead className="bg-slate-50 dark:bg-slate-900/60">
                <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-4">Professor</th>
                  <th className="px-5 py-4">Categoria</th>
                  <th className="px-5 py-4">Cadastro</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {professores.map((professor) => (
                  <tr
                    key={professor.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-700/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5f0e9] font-bold text-[#1f513a] dark:bg-emerald-950/60 dark:text-emerald-300">
                          {professor.usuario.nome.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {professor.usuario.nome}{" "}
                            {!professor.usuario.ativo && (
                              <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                                Inativo
                              </span>
                            )}
                          </p>

                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {professor.usuario.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200">
                        <GraduationCap size={14} />
                        {nomeCategoria(professor.categoria)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={16} />
                        {formatarData(professor.usuario.createdAt)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => abrirEdicao(professor)}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#b9d0c0] bg-white px-3.5 py-2 text-sm font-semibold text-[#1f513a] transition hover:bg-[#f2f7f4] dark:border-slate-600 dark:bg-slate-800 dark:text-emerald-300 dark:hover:bg-slate-700"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>

                        {professor.usuario.ativo ? (
                          <button
                            type="button"
                            onClick={() => {
                              setErro("");
                              setExcluindo(professor);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/30"
                          >
                            <Trash2 size={16} />
                            Desativar
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={processandoId === professor.id}
                            onClick={() => void reativar(professor)}
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3.5 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
                          >
                            <UserCheck size={16} />
                            Reativar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {!carregando && !erro && !professores.length && (
                  <tr>
                    <td colSpan={4} className="px-6 py-14 text-center">
                      <Users className="mx-auto text-slate-400" size={36} />

                      <p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">
                        Nenhum professor aprovado
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Os professores aprovados aparecerão aqui.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cartões para celular */}
          <div className="divide-y divide-slate-200 md:hidden dark:divide-slate-700">
            {professores.map((professor) => (
              <article key={professor.id} className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e5f0e9] font-bold text-[#1f513a] dark:bg-emerald-950/60 dark:text-emerald-300">
                    {professor.usuario.nome.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {professor.usuario.nome} {!professor.usuario.ativo && "(inativo)"}
                    </p>

                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                      {professor.usuario.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Categoria
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {nomeCategoria(professor.categoria)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cadastro
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {formatarData(professor.usuario.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => abrirEdicao(professor)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#b9d0c0] px-4 py-2.5 font-semibold text-[#1f513a] dark:border-slate-600 dark:text-emerald-300"
                  >
                    <Pencil size={17} />
                    Editar
                  </button>

                  {professor.usuario.ativo ? (
                    <button
                      type="button"
                      onClick={() => {
                        setErro("");
                        setExcluindo(professor);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-600 dark:border-red-900 dark:text-red-400"
                    >
                      <Trash2 size={17} />
                      Desativar
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={processandoId === professor.id}
                      onClick={() => void reativar(professor)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 font-semibold text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
                    >
                      <UserCheck size={17} />
                      Reativar
                    </button>
                  )}
                </div>
              </article>
            ))}

            {!carregando && !erro && !professores.length && (
              <div className="px-6 py-14 text-center text-slate-500 dark:text-slate-400">
                Nenhum professor aprovado.
              </div>
            )}
          </div>
        </section>

        <Modal
          isOpen={Boolean(editando)}
          title="Editar professor"
          onClose={() => !salvando && setEditando(null)}
        >
          <form className="space-y-5" onSubmit={salvarEdicao}>
            {erro && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                {erro}
              </p>
            )}
            <CampoFormulario label="Nome" htmlFor="professor-nome">
              <input
                id="professor-nome"
                value={form.nome}
                onChange={(event) =>
                  setForm({ ...form, nome: event.target.value })
                }
                required
                minLength={3}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#347b58] focus:ring-4 focus:ring-[#e5f0e9] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-950"
              />
            </CampoFormulario>

            <CampoFormulario label="E-mail" htmlFor="professor-email">
              <input
                id="professor-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#347b58] focus:ring-4 focus:ring-[#e5f0e9] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-950"
              />
            </CampoFormulario>

            <CampoFormulario label="Categoria" htmlFor="professor-categoria">
              <select
                id="professor-categoria"
                value={form.categoria}
                onChange={(event) =>
                  setForm({
                    ...form,
                    categoria: event.target.value as "INICIAIS" | "FINAIS",
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#347b58] focus:ring-4 focus:ring-[#e5f0e9] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-950"
              >
                <option value="INICIAIS">Anos Iniciais</option>
                <option value="FINAIS">Anos Finais</option>
              </select>
            </CampoFormulario>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
              <button
                type="button"
                onClick={() => setEditando(null)}
                disabled={salvando}
                className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={salvando}
                className="rounded-xl bg-[#1f513a] px-5 py-2.5 font-semibold text-white transition hover:bg-[#173d2c] disabled:opacity-50"
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={Boolean(excluindo)}
          title="Desativar professor"
          onClose={() => !salvando && setExcluindo(null)}
        >
          <div className="space-y-5">
            {erro && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                {erro}
              </p>
            )}
            <div className="flex gap-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
              <div className="h-fit rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-950 dark:text-red-300">
                <AlertTriangle size={22} />
              </div>

              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Desativar {excluindo?.usuario.nome}?
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  O acesso será bloqueado. Os pedidos e relatórios anteriores serão preservados. Você poderá reativar a conta depois.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setExcluindo(null)}
                disabled={salvando}
                className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarExclusao}
                disabled={salvando}
                className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {salvando ? "Desativando..." : "Desativar professor"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}

interface ResumoProps {
  titulo: string;
  valor: number;
  icone: React.ReactNode;
  cor: "verde" | "azul" | "dourado";
}

function Resumo({ titulo, valor, icone, cor }: ResumoProps) {
  const cores = {
    verde:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    azul: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    dourado:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {titulo}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {valor}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${cores[cor]}`}>{icone}</div>
      </div>
    </article>
  );
}

interface CampoFormularioProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}

function CampoFormulario({ label, htmlFor, children }: CampoFormularioProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      {children}
    </div>
  );
}
