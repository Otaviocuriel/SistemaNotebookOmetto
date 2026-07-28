import { useForm } from "react-hook-form";

interface PedidoFormData {
  sala: string;
  quantidade: number;
  observacao: string;
}

export default function PedidoForm() {
  const { register, handleSubmit, reset } = useForm<PedidoFormData>();

  function onSubmit(data: PedidoFormData) {
    console.log(data);

    alert("Pedido enviado com sucesso!");

    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <label className="block mb-2 font-medium">
          Sala
        </label>

        <input
          {...register("sala")}
          className="w-full border rounded-lg px-4 py-3"
          placeholder="Ex.: 7º A"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Quantidade de notebooks
        </label>

        <input
          type="number"
          {...register("quantidade")}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-blue-700 font-semibold">
          Notebooks disponíveis
        </p>

        <h2 className="text-3xl font-bold text-blue-700">
          28
        </h2>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Observação
        </label>

        <textarea
          {...register("observacao")}
          rows={4}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <button
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        Enviar Pedido
      </button>
    </form>
  );
}