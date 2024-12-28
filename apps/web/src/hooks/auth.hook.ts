import { AuthContext } from "@/contexts/auth.context";
import { signInSchema, SignInSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useSignIn() {
  const { signIn } = useAuth();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      id: v4(),
      name: "",
    },
  });

  return {
    form,
    signIn,
  };
}

export function useSignOut() {
  const { signOut } = useAuth();

  return {
    signOut,
  };
}
