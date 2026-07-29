import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { api, mensagemErro } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface PedidoFormData { sala: string; quantidade: number; }
interface Estoque { categoria: "INICIAIS" | "FINAIS"; disponivel: number; }

export default function PedidoForm() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, control } = useForm<PedidoFormData>();
  const [estoque, setEstoque] = useState<Estoque | null>(null);
  const [erro, setErro] = useState("");
  const quantidade = Number(useWatch({ control, name: "quantidade" })) || 0;

  useEffect(() => {
    api.get<Estoque[]>("/notebooks")
      .then(({ data }) => setEstoque(data.find((item) => item.categoria === usuario?.categoria) ?? null))
      .catch((error) => setErro(mensagemErro(error)));
  }, [usuario?.categoria]);

  async function onSubmit(data: PedidoFormData) {
    setErro("");
    try {
      await api.post("/pedidos", { sala: data.sala, quantidade: Number(data.quantidade) });
      navigate("/meus-pedidos");
    } catch (error) {
      setErro(mensagemErro(error));
    }
  }

  if (usuario?.tipo === "ADMIN") {
    return <p className="text-slate-600">Pedidos são criados por contas de professor.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-lg border bg-blue-50 p-4">
        <strong>{usuario?.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais"}</strong>
        <p className="text-sm text-slate-600">Disponíveis: {estoque?.disponivel ?? 0}</p>
      </div>
      {erro && <p className="rounded-lg bg-red-50 p-3 text-red-700">{erro}</p>}
      <input required {...register("sala")} className="w-full border rounded-lg px-4 py-3" placeholder="Sala (ex.: 7º A)" />
      <input required type="number" min={1} max={estoque?.disponivel ?? 0}
        {...register("quantidade", { valueAsNumber: true })}
        className="w-full border rounded-lg px-4 py-3" placeholder="Quantidade" />
      {estoque && quantidade > estoque.disponivel && (
        <p className="rounded-lg bg-red-50 p-3 text-red-700">Quantidade maior que o estoque disponível.</p>
      )}
      <button disabled={!estoque || quantidade < 1 || quantidade > estoque.disponivel}
        className="w-full bg-blue-600 disabled:bg-slate-400 text-white py-3 rounded-lg hover:bg-blue-700">
        Enviar Pedido
      </button>
    </form>
  );
}
