import AdminLayout from "../../layouts/AdminLayout";
import PedidoForm from "../../components/pedidos/PedidoForm";

export default function NovoPedido() {
  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">

        <h1 className="mb-5 text-2xl font-bold sm:mb-8 sm:text-3xl">
          Novo Pedido
        </h1>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
          <PedidoForm />
        </div>

      </div>
    </AdminLayout>
  );
}

