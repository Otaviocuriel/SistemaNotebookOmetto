import { z } from "zod";

export const professorSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  email: z
    .email("E-mail inválido"),

  senha: z
    .string()
    .min(10, "A senha deve ter pelo menos 10 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres")
    .regex(/[A-Za-zÀ-ÿ]/, "A senha deve conter uma letra")
    .regex(/[0-9]/, "A senha deve conter um número"),

  categoria: z.enum([
    "Anos Iniciais",
    "Anos Finais",
  ]),
});

export type ProfessorFormData = z.infer<typeof professorSchema>;

