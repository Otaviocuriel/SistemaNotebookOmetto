import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import type { NotebookCategoria } from "../../types/notebook";
import { notebooksMock } from "../../services/notebookService";
import { Laptop } from "lucide-react";

export default function Notebooks() {
  const [categorias] =
    useState<NotebookCategoria[]>(notebooksMock);

  return (
    <AdminLayout>
      <div className="space-y-8">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Gerenciamento de Notebooks
            </h1>

            <p className="text-slate-500 mt-1">
              Controle dos notebooks disponíveis na escola.
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {categorias.map((categoria) => (

            <div
              key={categoria.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold">
                    {categoria.categoria}
                  </h2>

                  <p className="text-slate-500">
                    Categoria de notebooks
                  </p>

                </div>

                <Laptop
                  size={40}
                  className="text-blue-600"
                />

              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">

                <div className="bg-slate-100 rounded-xl p-4">
                  <p className="text-slate-500">
                    Total
                  </p>

                  <h3 className="text-3xl font-bold">
                    {categoria.total}
                  </h3>
                </div>

                <div className="bg-green-100 rounded-xl p-4">
                  <p className="text-green-700">
                    Disponíveis
                  </p>

                  <h3 className="text-3xl font-bold text-green-700">
                    {categoria.disponiveis}
                  </h3>
                </div>

                <div className="bg-orange-100 rounded-xl p-4">
                  <p className="text-orange-700">
                    Em uso
                  </p>

                  <h3 className="text-3xl font-bold text-orange-700">
                    {categoria.emUso}
                  </h3>
                </div>

                <div className="bg-red-100 rounded-xl p-4">
                  <p className="text-red-700">
                    Manutenção
                  </p>

                  <h3 className="text-3xl font-bold text-red-700">
                    {categoria.manutencao}
                  </h3>
                </div>

              </div>

              <div className="flex gap-3 mt-8">

                <button
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
                >
                  Editar Quantidades
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </AdminLayout>
  );
}