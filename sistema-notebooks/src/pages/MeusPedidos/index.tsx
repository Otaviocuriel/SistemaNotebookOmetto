import AdminLayout from "../../layouts/AdminLayout";

const pedidos = [
  {
    id: 1,
    sala: "7º A",
    quantidade: 20,
    status: "Pendente",
    data: "28/07/2026",
  },
  {
    id: 2,
    sala: "8º B",
    quantidade: 25,
    status: "Em uso",
    data: "28/07/2026",
  },
  {
    id: 3,
    sala: "5º C",
    quantidade: 18,
    status: "Finalizado",
    data: "27/07/2026",
  },
];

function corStatus(status: string) {
  switch (status) {
    case "Pendente":
      return "bg-yellow-100 text-yellow-700";

    case "Em uso":
      return "bg-blue-100 text-blue-700";

    case "Finalizado":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function MeusPedidos() {
  return (
    <AdminLayout>
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Meus Pedidos
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>
                <th className="text-left p-4">Data</th>
                <th className="text-left p-4">Sala</th>
                <th className="text-left p-4">Quantidade</th>
                <th className="text-left p-4">Status</th>
              </tr>

            </thead>

            <tbody>

              {pedidos.map((pedido) => (

                <tr
                  key={pedido.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-4">
                    {pedido.data}
                  </td>

                  <td className="p-4">
                    {pedido.sala}
                  </td>

                  <td className="p-4">
                    {pedido.quantidade}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${corStatus(
                        pedido.status
                      )}`}
                    >
                      {pedido.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </AdminLayout>
  );
}