import { SignInSchema } from "@/schemas/auth.schema";
import { User } from "@/types/user.type";
import { createContext } from "react";

interface AuthContextData {
  user: User | undefined;
  signedIn: boolean;
  signIn(data: SignInSchema): void;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);
