import api from "@/config/api.config";
import { AuthContext } from "@/contexts/auth.context";
import {
  postUserSignIn,
  postUserSignUp,
  postVerifyToken,
} from "@/queries/user.queries";
import { SignInSchema, SignUpSchema } from "@/schemas/auth.schema";
import { useUserStore } from "@/stores/user.store";
import { ReactNode, useCallback, useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  async function signIn(data: SignInSchema) {
    try {
      setIsLoading(true);
      const { token, user } = await postUserSignIn(data);

      setUser(user);

      localStorage.setItem("AUTH_TOKEN", token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.error("Sign in failed:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(data: SignUpSchema) {
    try {
      setIsLoading(true);
      const { token, user } = await postUserSignUp(data);

      setUser(user);

      localStorage.setItem("AUTH_TOKEN", token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.error("Sign up failed:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem("AUTH_TOKEN");
      delete api.defaults.headers.Authorization;
      setUser(undefined);
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  }, [setUser]);

  const verifyToken = useCallback(
    async function () {
      const token = localStorage.getItem("AUTH_TOKEN");

      try {
        setIsLoading(true);

        if (!token) {
          throw new Error("No token found");
        }

        const { token: newToken, user } = await postVerifyToken(token);

        setUser(user);
        localStorage.setItem("AUTH_TOKEN", newToken);
        api.defaults.headers.Authorization = `Bearer ${newToken}`;
      } catch (error) {
        if (token) {
          console.error("Token validation failed:", error);
        }

        signOut();
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, signOut]
  );

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  useEffect(() => {
    function onTokenRemoved() {
      const token = localStorage.getItem("AUTH_TOKEN");

      if (!token) return signOut();

      verifyToken();
    }

    window.addEventListener("storage", onTokenRemoved);

    return () => {
      window.removeEventListener("storage", onTokenRemoved);
    };
  }, [signOut, verifyToken]);

  const value = {
    signedIn: !!user,
    isLoading,
    user,
    signIn,
    signOut,
    signUp,
    verifyToken,
    authModalOpen,
    setAuthModalOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
