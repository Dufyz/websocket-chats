import { AuthContext } from "@/contexts/auth.context";
import { SignInSchema } from "@/schemas/auth.schema";
import { useUserStore } from "@/stores/user.store";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  function signIn(data: SignInSchema) {
    try {
      setUser(data);
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    }
  }

  function signOut() {
    try {
      setUser(undefined);
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  }

  const value = {
    signedIn: !!user,
    user,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
