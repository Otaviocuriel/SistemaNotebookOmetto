import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { api, mensagemErro } from "../../services/api";

interface ProfessorApi {
  id: number;
  categoria: "INICIAIS" | "FINAIS";
  usuario: { id: number; nome: string; email: string; createdAt: string };
}

export default function Professores() {
  const [professores, setProfessores] = useState<ProfessorApi[]>([]);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      const { data } = await api.get<ProfessorApi[]>("/usuarios/professores");
      setProfessores(data);
      setErro("");
    } catch (error) {
      setErro(mensagemErro(error));
    }
  }

  useEffect(() => {
    api.get<ProfessorApi[]>("/usuarios/professores")
      .then(({ data }) => setProfessores(data))
      .catch((error) => setErro(mensagemErro(error)));
  }, []);

  async function editar(professor: ProfessorApi) {
    const nome = window.prompt("Nome do professor:", professor.usuario.nome);
    if (nome === null) return;

    const email = window.prompt("E-mail do professor:", professor.usuario.email);
    if (email === null) return;

    const categoriaDigitada = window.prompt(
      "Digite INICIAIS ou FINAIS:",
      professor.categoria
    );
    if (categoriaDigitada === null) return;

    const categoria = categoriaDigitada.trim().toUpperCase();
    if (categoria !== "INICIAIS" && categoria !== "FINAIS") {
      setErro("A categoria precisa ser INICIAIS ou FINAIS.");
      return;
    }

    try {
      await api.put(`/usuarios/professores/${professor.id}`, {
        nome,
        email,
        categoria,
      });
      await carregar();
    } catch (error) {
      setErro(mensagemErro(error));
    }
  }

  async function excluir(professor: ProfessorApi) {
    const confirmou = window.confirm(
      `Excluir ${professor.usuario.nome}? Os pedidos finalizados desse professor também serão apagados.`
    );
    if (!confirmou) return;

    try {
      await api.delete(`/usuarios/professores/${professor.id}`);
      await carregar();
    } catch (error) {
      setErro(mensagemErro(error));
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
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full">
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
                      onClick={() => editar(professor)}
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => excluir(professor)}
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
      </div>
    </AdminLayout>
  );
}
