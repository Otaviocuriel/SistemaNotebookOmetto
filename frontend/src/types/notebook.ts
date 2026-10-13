import type { Categoria } from "./pedido";

export interface NotebookCategoria {
  id: number;
  categoria: Categoria;
  total: number;
  disponivel: number;
  emUso: number;
  reservado: number;
  solicitavel: number;
}
