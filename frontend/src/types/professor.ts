import type { Categoria } from "./pedido";

export interface Professor {
  id: number;
  categoria: Categoria;
  usuario: {
    id: number;
    nome: string;
    email: string;
    ativo: boolean;
    createdAt: string;
  };
}
