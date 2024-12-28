import { z } from "zod";

export const signInSchema = z.object({
  name: z.string().nonempty("Por favor, insira um nome de usuário."),
  password: z.string().nonempty("Por favor, insira uma senha."),
});

export const signUpSchema = z.object({
  name: z.string().nonempty("Por favor, insira um nome de usuário."),
  password: z.string().nonempty("Por favor, insira uma senha."),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
