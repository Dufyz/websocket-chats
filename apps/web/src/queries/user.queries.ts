import api from "@/config/api.config";
import { SignInSchema, SignUpSchema } from "@/schemas/auth.schema";
import { User } from "@/types/user.type";

export async function postUserSignIn(data: SignInSchema): Promise<{
  token: string;
  user: User;
}> {
  const response = await api.post("/users/sign-in", data);

  return response.data;
}

export async function postUserSignUp(data: SignUpSchema): Promise<{
  token: string;
  user: User;
}> {
  const response = await api.post("/users/sign-up", data);

  return response.data;
}

export async function postVerifyToken(token: string): Promise<{
  token: string;
  user: User;
}> {
  const response = await api.post("/users/verify-token", { token });

  return response.data;
}
