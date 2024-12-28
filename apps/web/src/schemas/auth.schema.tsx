import { z } from "zod";

export const signInSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty("Por favor, insira um nome de usuário."),
});

export type SignInSchema = z.infer<typeof signInSchema>;
