import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, mensagemErro } from "../../services/api";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { CheckCircle2 } from "lucide-react";

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "", email: "", senha: "", categoria: "INICIAIS",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function atualizar(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((atual) => ({ ...atual, [e.target.name]: e.target.value }));
  }

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    try {
      await api.post("/auth/register", form);
      setSucesso(true);
    } catch (error) {
      setErro(mensagemErro(error));
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      {sucesso ? (
        <div className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 text-center shadow-md sm:p-8">
          <CheckCircle2 className="mx-auto text-green-600" size={56} />
          <h1 className="text-2xl font-bold">Cadastro enviado!</h1>
          <p className="leading-6 text-slate-500">
            Sua conta está aguardando a aprovação de um administrador da escola.
            Depois de aprovada, você poderá entrar normalmente.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
          >
            Voltar para o login
          </button>
        </div>
      ) : (
      <form onSubmit={cadastrar} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-md sm:p-8">
        <h1 className="text-3xl font-bold text-center">Cadastro de professor</h1>
        <p className="text-center text-sm text-slate-500">Contas administrativas são criadas somente pela escola.</p>
        {erro && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
        <input required minLength={3} name="nome" placeholder="Nome" value={form.nome} onChange={atualizar} className="w-full border p-3 rounded-lg" />
        <input required name="email" placeholder="E-mail" type="email" value={form.email} onChange={atualizar} className="w-full border p-3 rounded-lg" />
        <input required minLength={6} name="senha" placeholder="Senha (mínimo 6 caracteres)" type="password" value={form.senha} onChange={atualizar} className="w-full border p-3 rounded-lg" />
        <select name="categoria" value={form.categoria} onChange={atualizar} className="w-full border p-3 rounded-lg">
          <option value="INICIAIS">Anos Iniciais</option>
          <option value="FINAIS">Anos Finais</option>
        </select>
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">Cadastrar</button>
        <button type="button" onClick={() => navigate("/login")} className="w-full text-blue-600 hover:underline">Voltar para Login</button>
      </form>
      )}
    </div>
  );
}

