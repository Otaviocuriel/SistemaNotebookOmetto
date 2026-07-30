import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ThemeToggle from "../../components/ui/ThemeToggle";
import { api, mensagemErro } from "../../services/api";

type Categoria = "INICIAIS" | "FINAIS";

interface Formulario {
  nome: string;
  email: string;
  senha: string;
  categoria: Categoria;
}

const classeCampo =
  "w-full rounded-xl border border-[#cbd8d0] bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[#347b58] focus:ring-4 focus:ring-[#347b58]/10 dark:border-[#385145] dark:bg-[#0c1711] dark:text-white";

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Formulario>({
    nome: "",
    email: "",
    senha: "",
    categoria: "INICIAIS",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  function atualizar(
    evento: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = evento.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      await api.post("/auth/register", form);
      setSucesso(true);
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="relative grid min-h-screen bg-[#f3f6f4] dark:bg-[#08110d] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <section className="relative hidden overflow-hidden bg-[#173d2c] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full border-[70px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-36 -right-24 h-[420px] w-[420px] rounded-full border-[80px] border-[#347b58]/30" />

        <div className="relative z-10 flex items-center gap-4">
          <img
            src="/logo-ometto.svg"
            alt="E.E. José Ometto"
            className="h-16 w-16 rounded-full border-2 border-white/80 bg-white object-cover shadow-xl"
          />

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
              E.E. José Ometto
            </p>
            <h1 className="mt-1 text-xl font-bold">
              Sistema Notebook Ometto
            </h1>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d8c287]">
            Gestão escolar
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em] xl:text-5xl">
            Notebooks organizados para apoiar cada aula.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-emerald-100/80">
            Solicite equipamentos, acompanhe pedidos e consulte o estoque em
            um único ambiente.
          </p>
        </div>

        <p className="relative z-10 text-sm text-emerald-100/60">
          Programa de Ensino Integral
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-20 sm:px-8">
        {sucesso ? (
          <div className="w-full max-w-md rounded-[22px] border border-[#dce5df] bg-white p-6 text-center shadow-[0_18px_50px_rgba(16,45,33,0.09)] dark:border-[#294337] dark:bg-[#101c16] sm:p-8">
            <div className="mb-8 lg:hidden">
              <img
                src="/logo-ometto.svg"
                alt="E.E. José Ometto"
                className="mx-auto h-20 w-20 rounded-full border-2 border-white object-cover shadow-md"
              />
            </div>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#347b58] dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2 size={36} />
            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#347b58] dark:text-emerald-400">
              Solicitação enviada
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-900 dark:text-white">
              Cadastro recebido
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Sua conta está aguardando a aprovação de um administrador da
              escola. Depois de aprovada, você poderá entrar normalmente.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f513a] px-5 py-3 font-bold text-white shadow-[0_4px_14px_rgba(31,81,58,0.2)] transition hover:bg-[#173d2c]"
            >
              <ArrowLeft size={18} />
              Voltar para o login
            </button>
          </div>
        ) : (
          <form
            onSubmit={cadastrar}
            className="w-full max-w-md rounded-[22px] border border-[#dce5df] bg-white p-6 shadow-[0_18px_50px_rgba(16,45,33,0.09)] dark:border-[#294337] dark:bg-[#101c16] sm:p-8"
          >
            <div className="mb-8 lg:hidden">
              <img
                src="/logo-ometto.svg"
                alt="E.E. José Ometto"
                className="mb-5 h-20 w-20 rounded-full border-2 border-white object-cover shadow-md"
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#347b58] dark:text-emerald-400">
                Solicitação de acesso
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-900 dark:text-white">
                Cadastro de professor
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Preencha seus dados para solicitar acesso ao sistema.
              </p>
            </div>

            {erro && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                {erro}
              </p>
            )}

            <div className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  Nome completo
                </label>
                <div className="relative">
                  <UserRound
                    size={19}
                    className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400"
                  />
                  <input
                    id="nome"
                    required
                    minLength={3}
                    name="nome"
                    autoComplete="name"
                    placeholder="Digite seu nome"
                    value={form.nome}
                    onChange={atualizar}
                    className={classeCampo}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    size={19}
                    className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400"
                  />
                  <input
                    id="email"
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nome@escola.com"
                    value={form.email}
                    onChange={atualizar}
                    className={classeCampo}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  Senha
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400"
                  />
                  <input
                    id="senha"
                    required
                    minLength={10}
                    maxLength={72}
                    pattern="(?=.*[A-Za-zÀ-ÿ])(?=.*[0-9]).{10,72}"
                    title="Use pelo menos 10 caracteres, com letras e números."
                    name="senha"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Mínimo de 10 caracteres"
                    value={form.senha}
                    onChange={atualizar}
                    className={classeCampo}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="categoria"
                  className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  Categoria de ensino
                </label>
                <div className="relative">
                  <GraduationCap
                    size={19}
                    className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400"
                  />
                  <select
                    id="categoria"
                    name="categoria"
                    value={form.categoria}
                    onChange={atualizar}
                    className={`${classeCampo} appearance-none`}
                  >
                    <option value="INICIAIS">Anos Iniciais</option>
                    <option value="FINAIS">Anos Finais</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              disabled={enviando}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f513a] px-5 py-3 font-bold text-white shadow-[0_4px_14px_rgba(31,81,58,0.2)] transition hover:bg-[#173d2c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Solicitar cadastro"}
              {!enviando && <ArrowRight size={18} />}
            </button>

            <div className="mt-6 border-t border-[#e3ebe6] pt-5 text-center dark:border-[#294337]">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Já possui acesso?
              </p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-2 font-bold text-[#286548] transition hover:text-[#173d2c] hover:underline dark:text-emerald-400"
              >
                Voltar para o login
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
