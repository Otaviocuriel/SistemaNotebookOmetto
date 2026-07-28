import { useForm } from "react-hook-form";
import { useNotebook } from "../../context/NotebookContext";

interface PedidoFormData {
  sala: string;
  quantidade: number;
  observacao: string;
}


export default function PedidoForm() {

  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm<PedidoFormData>();


  const { notebooks } = useNotebook();


  // Simulando professor logado
  const categoria =
    "Anos Finais";


  const tipo =
    categoria === "Anos Iniciais"
      ? notebooks.iniciais
      : notebooks.finais;



  const quantidade =
    Number(watch("quantidade")) || 0;



  function onSubmit(data: PedidoFormData) {


    if (
      data.quantidade > tipo.disponiveis
    ) {

      alert(
        "Quantidade solicitada maior que o estoque disponível."
      );

      return;

    }


    console.log({
      ...data,
      categoria,
    });


    alert(
      "Pedido enviado com sucesso!"
    );


    reset();

  }



  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >


      <div>

        <label className="block mb-2 font-medium">
          Categoria
        </label>


        <div className="bg-blue-50 border rounded-lg p-4">

          <strong>
            {categoria}
          </strong>

          <p className="text-sm text-slate-500">
            O sistema definiu automaticamente pela categoria do professor.
          </p>

        </div>

      </div>




      <div>

        <label className="block mb-2 font-medium">
          Sala
        </label>


        <input
          {...register("sala")}
          className="w-full border rounded-lg px-4 py-3"
          placeholder="Ex: 7º A"
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





      <div className="bg-green-50 border rounded-lg p-4">

        <p className="font-semibold text-green-700">
          Notebooks disponíveis
        </p>


        <p className="text-3xl font-bold text-green-700">
          {tipo.disponiveis}
        </p>


      </div>





      {quantidade > tipo.disponiveis && (

        <div className="bg-red-100 text-red-700 p-4 rounded-lg">

          Quantidade solicitada maior que o estoque disponível.

        </div>

      )}






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
        disabled={
          quantidade > tipo.disponiveis
        }
        className={`w-full py-3 rounded-lg text-white font-semibold
        ${
          quantidade > tipo.disponiveis
            ? "bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >

        Enviar Pedido

      </button>



    </form>

  );

}