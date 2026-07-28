import AdminLayout from "../../layouts/AdminLayout";

export default function Relatorios() {
  return (
    <AdminLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold">
            Relatórios
          </h1>

          <p className="text-slate-500 mt-2">
            Acompanhe os dados de utilização dos notebooks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow border">
            <h3 className="text-slate-500">
              Pedidos realizados
            </h3>

            <p className="text-4xl font-bold mt-3">
              152
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border">
            <h3 className="text-slate-500">
              Notebooks utilizados
            </h3>

            <p className="text-4xl font-bold mt-3">
              2.864
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border">
            <h3 className="text-slate-500">
              Professores cadastrados
            </h3>

            <p className="text-4xl font-bold mt-3">
              48
            </p>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}