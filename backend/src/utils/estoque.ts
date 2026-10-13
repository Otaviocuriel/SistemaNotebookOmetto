export function solicitavel(disponivel: number, reservado: number) {
  return Math.max(0, disponivel - reservado);
}

export function totalSuportaCompromissos(
  total: number,
  emUso: number,
  reservado: number
) {
  return total >= emUso + reservado;
}
