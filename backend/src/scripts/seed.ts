import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import { prisma } from "../utils/prisma.js";

const administradores = [
  { nome: "Otávio", email: env.OTAVIO_ADMIN_EMAIL, senha: env.OTAVIO_ADMIN_PASSWORD },
  { nome: "Gabriel", email: env.GABRIEL_ADMIN_EMAIL, senha: env.GABRIEL_ADMIN_PASSWORD },
].filter(
  (admin): admin is { nome: string; email: string; senha: string } =>
    Boolean(admin.email && admin.senha)
);

for (const admin of administradores) {
  const senhaHash = await bcrypt.hash(admin.senha, 10);
  await prisma.usuario.upsert({
    where: { email: admin.email.toLowerCase() },
    create: {
      nome: admin.nome,
      email: admin.email.toLowerCase(),
      senha: senhaHash,
      tipo: "ADMIN",
    },
    update: {},
  });
}

for (const categoria of ["INICIAIS", "FINAIS"] as const) {
  await prisma.notebook.upsert({
    where: { categoria },
    create: { categoria, total: 0, disponivel: 0, emUso: 0 },
    update: {},
  });
}

console.log(`${administradores.length} administrador(es) configurado(s).`);
await prisma.$disconnect();
