import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import {
  AlertCircle,
  Boxes,
  CheckCircle2,
  Hash,
  LoaderCircle,
  MapPin,
  Send,
  ShieldAlert,
} from "lucide-react";

import { api, mensagemErro } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface PedidoFormData {
  sala: string;
  quantidade: number;
}

interface Estoque {
  categoria: "INICIAIS" | "FINAIS";
  disponivel: number;
}

export default function PedidoForm() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<PedidoFormData>({
    defaultValues: {
      sala: "",
      quantidade: undefined,
    },
  });

  const [estoque, setEstoque] = useState<Estoque | null>(null);
  const [erro, setErro] = useState("");
  const [carregandoEstoque, setCarregandoEstoque] = useState(true);

  const quantidade =
    Number(useWatch({ control, name: "quantidade" })) || 0;

  useEffect(() => {
  let ativo = true;

  api
    .get<Estoque[]>("/notebooks")
    .then(({ data }) => {
      if (!ativo) return;

      const estoqueCategoria =
        data.find(
          (item) => item.categoria === usuario?.categoria
        ) ?? null;

      setEstoque(estoqueCategoria);
      setErro("");
    })
    .catch((error) => {
      if (!ativo) return;

      setErro(mensagemErro(error));
    })
    .finally(() => {
      if (!ativo) return;

      setCarregandoEstoque(false);
    });

  return () => {
    ativo = false;
  };
}, [usuario?.categoria]);

  async function onSubmit(data: PedidoFormData) {
    setErro("");

    try {
      await api.post("/pedidos", {
        sala: data.sala.trim(),
        quantidade: Number(data.quantidade),
      });

      navigate("/meus-pedidos");
    } catch (error) {
      setErro(mensagemErro(error));
    }
  }

  if (usuario?.tipo === "ADMIN") {
    return (
      <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
        <div className="rounded-full bg-amber-100 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          <ShieldAlert size={21} />
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Área exclusiva para professores
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Os pedidos de notebooks são criados por contas de professor.
            Administradores podem acompanhar e atender os pedidos recebidos.
          </p>
        </div>
      </div>
    );
  }

  const nomeCategoria =
    usuario?.categoria === "INICIAIS"
      ? "Anos Iniciais"
      : "Anos Finais";

  const disponivel = estoque?.disponivel ?? 0;
  const quantidadeInvalida =
    quantidade < 1 || quantidade > disponivel;

  const percentualSolicitado =
    disponivel > 0
      ? Math.min((quantidade / disponivel) * 100, 100)
      : 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <section className="overflow-hidden rounded-xl border border-[#c7d9cd] bg-[#f2f7f4] dark:border-emerald-900/60 dark:bg-emerald-950/30">
        <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="rounded-xl bg-white p-2.5 text-[#1f513a] shadow-sm dark:bg-slate-800 dark:text-emerald-300">
              <Boxes size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#347b58] dark:text-emerald-400">
                Sua categoria
              </p>

              <h3 className="mt-1 font-bold text-slate-900 dark:text-slate-100">
                {nomeCategoria}
              </h3>
            </div>
          </div>

          <div className="text-right">
            {carregandoEstoque ? (
              <LoaderCircle
                className="animate-spin text-[#347b58] dark:text-emerald-400"
                size={24}
              />
            ) : (
              <>
                <p className="text-2xl font-bold text-[#1f513a] dark:text-emerald-300">
                  {disponivel}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  disponíveis
                </p>
              </>
            )}
          </div>
        </div>

        {!carregandoEstoque && (
          <div className="border-t border-[#c7d9cd] px-4 py-3 text-sm text-slate-600 sm:px-5 dark:border-emerald-900/60 dark:text-slate-300">
            {disponivel > 0 ? (
              <span className="flex items-center gap-2">
                <CheckCircle2
                  className="text-[#347b58] dark:text-emerald-400"
                  size={17}
                />

                Equipamentos disponíveis para solicitação.
              </span>
            ) : (
              <span className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <AlertCircle size={17} />
                Nenhum notebook disponível no momento.
              </span>
            )}
          </div>
        )}
      </section>

      {erro && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 shrink-0" size={19} />
          <p className="text-sm">{erro}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="pedido-sala"
          className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          Sala
        </label>

        <div className="relative">
          <MapPin
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={19}
          />

          <input
            id="pedido-sala"
            type="text"
            placeholder="Exemplo: 7º A"
            autoComplete="off"
            {...register("sala", {
              required: "Informe a sala.",
              minLength: {
                value: 2,
                message: "Informe uma sala válida.",
              },
              maxLength: {
                value: 30,
                message: "A sala deve ter no máximo 30 caracteres.",
              },
            })}
            className={`w-full rounded-xl border bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-800 dark:text-slate-100 ${
              errors.sala
                ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:border-red-700 dark:focus:ring-red-950"
                : "border-slate-300 focus:border-[#347b58] focus:ring-[#e5f0e9] dark:border-slate-600 dark:focus:border-emerald-600 dark:focus:ring-emerald-950"
            }`}
          />
        </div>

        {errors.sala && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.sala.message}
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="pedido-quantidade"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Quantidade
          </label>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            Máximo: {disponivel}
          </span>
        </div>

        <div className="relative">
          <Hash
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={19}
          />

          <input
            id="pedido-quantidade"
            type="number"
            min={1}
            max={disponivel}
            placeholder="Digite a quantidade"
            {...register("quantidade", {
              required: "Informe a quantidade.",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "A quantidade mínima é 1.",
              },
              max: {
                value: disponivel,
                message: `Existem apenas ${disponivel} notebooks disponíveis.`,
              },
            })}
            className={`w-full rounded-xl border bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-800 dark:text-slate-100 ${
              errors.quantidade ||
              (quantidade > disponivel && quantidade > 0)
                ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:border-red-700 dark:focus:ring-red-950"
                : "border-slate-300 focus:border-[#347b58] focus:ring-[#e5f0e9] dark:border-slate-600 dark:focus:border-emerald-600 dark:focus:ring-emerald-950"
            }`}
          />
        </div>

        {errors.quantidade && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.quantidade.message}
          </p>
        )}

        {!errors.quantidade &&
          estoque &&
          quantidade > estoque.disponivel && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              A quantidade informada é maior que o estoque disponível.
            </p>
          )}

        {quantidade > 0 &&
          quantidade <= disponivel &&
          disponivel > 0 && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/60">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Quantidade solicitada
                </span>

                <strong className="text-slate-900 dark:text-slate-100">
                  {quantidade} de {disponivel}
                </strong>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-[#347b58] transition-all"
                  style={{
                    width: `${percentualSolicitado}%`,
                  }}
                />
              </div>
            </div>
          )}
      </div>

      <button
        type="submit"
        disabled={
          carregandoEstoque ||
          !estoque ||
          quantidadeInvalida ||
          isSubmitting
        }
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f513a] px-5 py-3.5 font-semibold text-white transition hover:bg-[#173d2c] disabled:cursor-not-allowed disabled:bg-slate-400 dark:disabled:bg-slate-600"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="animate-spin" size={19} />
            Enviando pedido...
          </>
        ) : (
          <>
            <Send size={19} />
            Enviar pedido
          </>
        )}
      </button>

      <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
        Ao enviar, os administradores serão avisados sobre a nova solicitação.
      </p>
    </form>
  );
}