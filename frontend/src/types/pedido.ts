export type Categoria = "INICIAIS" | "FINAIS";

export type StatusPedido =
  | "PENDENTE"
  | "EM_USO"
  | "RETIRADA_SOLICITADA"
  | "FINALIZADO"
  | "CANCELADO";

export interface Pedido {
  id: number;
  sala: string;
  quantidade: number;
  categoria: Categoria;
  status: StatusPedido;
  createdAt: string;
  entregueAt: string | null;
  finalizadoAt: string | null;
  canceladoAt: string | null;
  professor: {
    usuario: { nome: string; email: string };
  };
}

export const statusPedidoConfig: Record<
  StatusPedido,
  { label: string; classes: string }
> = {
  PENDENTE: {
    label: "Pendente",
    classes: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300",
  },
  EM_USO: {
    label: "Em uso",
    classes: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300",
  },
  RETIRADA_SOLICITADA: {
    label: "Retirada solicitada",
    classes: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-300",
  },
  FINALIZADO: {
    label: "Finalizado",
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  CANCELADO: {
    label: "Cancelado",
    classes: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300",
  },
};
