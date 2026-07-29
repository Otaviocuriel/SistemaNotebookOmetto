import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, mensagemErro } from "../../services/api";
import { useAuth, type Usuario } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { usuario, login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to="/dashboard" replace />;

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const { data } = await api.post<{ token: string; usuario: Usuario }>(
        "/auth/login",
        { email, senha }
      );
      login(data.usuario, data.token);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form onSubmit={entrar} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-5">
        <div className="text-center">
          <img
            src="/logo-ometto.svg"
            alt="E.E. José Ometto"
            className="mx-auto mb-4 h-24 w-24 rounded-full border border-slate-200 object-cover shadow-sm"
          />
          <h1 className="text-3xl font-bold text-slate-800">Sistema Notebook Ometto</h1>
          <p className="text-slate-500 mt-2">Faça login para continuar</p>
        </div>
        {erro && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
        <input required type="email" placeholder="E-mail" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
        <input required type="password" placeholder="Senha" value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
        <button disabled={enviando} className="w-full bg-blue-600 disabled:bg-blue-300 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
          {enviando ? "Entrando..." : "Entrar"}
        </button>
        <button type="button" onClick={() => navigate("/cadastro")} className="w-full text-blue-600 hover:underline">
          Cadastrar professor
        </button>
      </form>
    </div>
  );
}

