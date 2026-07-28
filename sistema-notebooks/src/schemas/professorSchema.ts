import { z } from "zod";

export const professorSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  email: z
    .email("E-mail inválido"),

  senha: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),

  categoria: z.enum([
    "Anos Iniciais",
    "Anos Finais",
  ]),
});

export type ProfessorFormData = z.infer<typeof professorSchema>;