export interface Professor {
  id: number;
  nome: string;
  email: string;
  categoria: "Anos Iniciais" | "Anos Finais";
  status: "Ativo" | "Inativo";
}