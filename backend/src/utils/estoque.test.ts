import assert from "node:assert/strict";
import test from "node:test";
import { solicitavel, totalSuportaCompromissos } from "./estoque.js";

test("pedidos pendentes reservam estoque até a entrega ou cancelamento", () => {
  const total = 10;
  const emUso = 2;
  const disponivel = total - emUso;
  const reservado = 5;

  assert.equal(solicitavel(disponivel, reservado), 3);
  assert.equal(totalSuportaCompromissos(6, emUso, reservado), false);
  assert.equal(totalSuportaCompromissos(7, emUso, reservado), true);

  // Na entrega, cinco notebooks saem dos pendentes e passam para em uso.
  assert.equal(solicitavel(disponivel - 5, reservado - 5), 3);
  // No cancelamento, os mesmos cinco voltam a ficar solicitáveis.
  assert.equal(solicitavel(disponivel, reservado - 5), 8);
});

test("pedidos antigos acima do estoque não geram disponibilidade negativa", () => {
  assert.equal(solicitavel(4, 6), 0);
  assert.equal(totalSuportaCompromissos(9, 4, 6), false);
});
