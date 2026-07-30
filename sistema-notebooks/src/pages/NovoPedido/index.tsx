import {
  CheckCircle2,
  ClipboardPlus,
  Info,
  Laptop,
  ShieldCheck,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import PedidoForm from "../../components/pedidos/PedidoForm";

export default function NovoPedido() {
  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#347b58] dark:text-emerald-400">
            Solicitação de equipamentos
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Novo pedido
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            Informe a sala e a quantidade de notebooks necessária para a aula.
          </p>
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div className="rounded-xl bg-[#e5f0e9] p-2.5 text-[#1f513a] dark:bg-emerald-950/50 dark:text-emerald-300">
                <ClipboardPlus size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Dados do pedido
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Preencha as informações para enviar a solicitação.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <PedidoForm />
            </div>
          </article>

          <aside className="space-y-4">
            <article className="rounded-2xl border border-[#c7d9cd] bg-[#f2f7f4] p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-2.5 text-[#1f513a] shadow-sm dark:bg-slate-800 dark:text-emerald-300">
                  <Laptop size={21} />
                </div>

                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Antes de solicitar
                </h2>
              </div>

              <ul className="mt-5 space-y-4">
                <Orientacao texto="Confira a quantidade disponível para sua categoria." />

                <Orientacao texto="Informe corretamente a sala onde será realizada a entrega." />

                <Orientacao texto="Solicite apenas a quantidade necessária para a aula." />
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                  <Info size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                    Como funciona?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Após o envio, os administradores receberão o pedido e
                    poderão registrar a entrega dos equipamentos.
                  </p>
                </div>
              </div>
            </article>

            <article className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-[#347b58] dark:text-emerald-400"
                size={22}
              />

              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                O pedido ficará vinculado à sua conta e poderá ser acompanhado
                na página <strong>Meus pedidos</strong>.
              </p>
            </article>
          </aside>
        </section>
      </div>
    </AdminLayout>
  );
}

function Orientacao({ texto }: { texto: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2
        className="mt-0.5 shrink-0 text-[#347b58] dark:text-emerald-400"
        size={18}
      />

      <span className="text-sm leading-6 text-slate-600 dark:text-slate-300">
        {texto}
      </span>
    </li>
  );
}