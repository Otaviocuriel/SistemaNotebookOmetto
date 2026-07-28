export type StatusPedido =
  | "Pendente"
  | "Em uso"
  | "Finalizado";

export interface Pedido {
  id: number;
  professor: string;
  sala: string;
  quantidade: number;
  categoria: "Anos Iniciais" | "Anos Finais";
  status: StatusPedido;
  data: string;
}