import { AuthContext } from "@/contexts/auth.context";
import {
  signInSchema,
  SignInSchema,
  signUpSchema,
  SignUpSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

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
      name: "",
      password: "",
    },
  });

  return {
    form,
    signIn,
  };
}

export function useSignUp() {
  const { signUp } = useAuth();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      password: "",
    },
  });

  return {
    form,
    signUp,
  };
}

export function useSignOut() {
  const { signOut } = useAuth();

  return {
    signOut,
  };
}
