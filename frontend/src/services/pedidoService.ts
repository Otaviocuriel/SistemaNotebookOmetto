import type { Pedido } from "../types/pedido";

export const pedidosMock: Pedido[] = [
  {
    id: 1,
    professor: "João Silva",
    sala: "7º A",
    quantidade: 20,
    categoria: "Anos Finais",
    status: "Pendente",
    data: "28/07/2026",
  },
  {
    id: 2,
    professor: "Maria Souza",
    sala: "4º C",
    quantidade: 18,
    categoria: "Anos Iniciais",
    status: "Em uso",
    data: "28/07/2026",
  },
];