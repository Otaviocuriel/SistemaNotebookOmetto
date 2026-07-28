import AdminLayout from "../../layouts/AdminLayout";
import PedidoForm from "../../components/pedidos/PedidoForm";

export default function NovoPedido() {
  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Novo Pedido
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <PedidoForm />
        </div>

      </div>
    </AdminLayout>
  );
}