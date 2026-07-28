import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AdminLayout from "../../layouts/AdminLayout";
import Modal from "../../components/ui/Modal";

import {
  professorSchema,
  type ProfessorFormData,
} from "../../schemas/professorSchema";

import { professoresMock } from "../../services/professorService";
import type { Professor } from "../../types/professor";

export default function Professores() {
  const [open, setOpen] = useState(false);

  const [professores, setProfessores] =
    useState<Professor[]>(professoresMock);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfessorFormData>({
    resolver: zodResolver(professorSchema),
  });

  function onSubmit(data: ProfessorFormData) {
    const novoProfessor: Professor = {
      id: professores.length + 1,
      nome: data.nome,
      email: data.email,
      categoria: data.categoria,
      status: "Ativo",
    };

    setProfessores([...professores, novoProfessor]);

    reset();
    setOpen(false);
  }
    return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Professores</h1>

          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
          >
            + Novo Professor
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="Pesquisar professor..."
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">E-mail</th>
                <th className="p-4 text-left">Categoria</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {professores.map((professor) => (
                <tr
                  key={professor.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-4 font-medium">
                    {professor.nome}
                  </td>

                  <td className="p-4">
                    {professor.email}
                  </td>

                  <td className="p-4">
                    {professor.categoria}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        professor.status === "Ativo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {professor.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
                        Editar
                      </button>

                      <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={open}
          title="Cadastrar Professor"
          onClose={() => {
            reset();
            setOpen(false);
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block font-medium">
                Nome
              </label>

              <input
                {...register("nome")}
                className="w-full rounded-lg border px-4 py-3"
                placeholder="Nome do professor"
              />

              {errors.nome && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block font-medium">
                E-mail
              </label>

              <input
                type="email"
                {...register("email")}
                className="w-full rounded-lg border px-4 py-3"
                placeholder="email@escola.com"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Senha
              </label>

              <input
                type="password"
                {...register("senha")}
                className="w-full rounded-lg border px-4 py-3"
              />

              {errors.senha && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.senha.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Categoria
              </label>

              <select
                {...register("categoria")}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="">
                  Selecione...
                </option>

                <option value="Anos Iniciais">
                  Anos Iniciais
                </option>

                <option value="Anos Finais">
                  Anos Finais
                </option>
              </select>

              {errors.categoria && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.categoria.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="rounded-lg border px-5 py-2"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}