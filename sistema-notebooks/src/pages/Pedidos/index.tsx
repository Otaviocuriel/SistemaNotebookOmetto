import AdminLayout from "../../layouts/AdminLayout";
import { usePedidos } from "../../context/PedidoContext";
import { useNotebook } from "../../context/NotebookContext";

export default function Pedidos() {

  const { pedidos, setPedidos } = usePedidos();

  const {
    entregarNotebook,
    receberNotebook,
  } = useNotebook();


  function alterarStatus(
    id: number,
    novoStatus: "Em uso" | "Finalizado"
  ) {

    const pedido = pedidos.find(
      (item) => item.id === id
    );


    if (!pedido) return;


    if (novoStatus === "Em uso") {

      entregarNotebook(
        pedido.categoria,
        pedido.quantidade
      );

    }


    if (novoStatus === "Finalizado") {

      receberNotebook(
        pedido.categoria,
        pedido.quantidade
      );

    }


    setPedidos((atual) =>
      atual.map((item) =>
        item.id === id
          ? {
              ...item,
              status: novoStatus,
            }
          : item
      )
    );

  }


  function corStatus(status: string) {

    if (status === "Pendente") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Em uso") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-green-100 text-green-700";

  }


  return (
    <AdminLayout>

      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Pedidos
          </h1>

          <p className="text-slate-500">
            Controle de entrega e devolução dos notebooks.
          </p>
        </div>


        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  Professor
                </th>

                <th className="p-4 text-left">
                  Sala
                </th>

                <th className="p-4 text-left">
                  Quantidade
                </th>

                <th className="p-4 text-left">
                  Categoria
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-center">
                  Ação
                </th>

              </tr>

            </thead>


            <tbody>

              {pedidos.map((pedido) => (

                <tr
                  key={pedido.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {pedido.professor}
                  </td>


                  <td className="p-4">
                    {pedido.sala}
                  </td>


                  <td className="p-4">
                    {pedido.quantidade}
                  </td>


                  <td className="p-4">
                    {pedido.categoria}
                  </td>


                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${corStatus(
                        pedido.status
                      )}`}
                    >
                      {pedido.status}
                    </span>

                  </td>


                  <td className="p-4 text-center">

                    {pedido.status === "Pendente" && (

                      <button
                        onClick={() =>
                          alterarStatus(
                            pedido.id,
                            "Em uso"
                          )
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Entregar
                      </button>

                    )}


                    {pedido.status === "Em uso" && (

                      <button
                        onClick={() =>
                          alterarStatus(
                            pedido.id,
                            "Finalizado"
                          )
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Receber
                      </button>

                    )}


                    {pedido.status === "Finalizado" && (

                      <span className="text-slate-400">
                        Concluído
                      </span>

                    )}

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