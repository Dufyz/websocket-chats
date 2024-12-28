import { SignInSchema, SignUpSchema } from "@/schemas/auth.schema";
import { User } from "@/types/user.type";
import { createContext, Dispatch, SetStateAction } from "react";

interface AuthContextData {
  authModalOpen: boolean;
  setAuthModalOpen: Dispatch<SetStateAction<boolean>>;
  user: User | undefined;
  signedIn: boolean;
  isLoading: boolean;
  signIn(data: SignInSchema): Promise<void>;
  signUp(data: SignUpSchema): Promise<void>;
  signOut(): void;
  verifyToken(): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);
