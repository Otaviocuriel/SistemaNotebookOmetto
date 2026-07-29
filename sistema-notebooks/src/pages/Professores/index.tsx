import { useEffect, useState } from "react";
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
  useEffect(() => {
    api.get<ProfessorApi[]>("/usuarios/professores")
      .then(({ data }) => setProfessores(data))
      .catch((error) => setErro(mensagemErro(error)));
  }, []);

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
              {["Nome", "E-mail", "Categoria", "Cadastro"].map((x) => <th key={x} className="p-4 text-left">{x}</th>)}
            </tr></thead>
            <tbody>
              {professores.map((professor) => <tr key={professor.id} className="border-t">
                <td className="p-4 font-medium">{professor.usuario.nome}</td>
                <td className="p-4">{professor.usuario.email}</td>
                <td className="p-4">{professor.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais"}</td>
                <td className="p-4">{new Date(professor.usuario.createdAt).toLocaleDateString("pt-BR")}</td>
              </tr>)}
              {!professores.length && <tr><td colSpan={4} className="p-8 text-center text-slate-500">Nenhum professor cadastrado.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
