export interface NotebookCategoria {
  id: number;
  categoria: "Anos Iniciais" | "Anos Finais";
  total: number;
  disponiveis: number;
  emUso: number;
  manutencao: number;
}