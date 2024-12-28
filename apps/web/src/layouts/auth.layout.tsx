import { Outlet } from "react-router-dom";

import "@/styles/globals.css";
import AuthModal from "@/components/auth/auth-modal";
import { useEffect } from "react";
import { useAuth } from "@/hooks/auth.hook";

export default function AuthLayout() {
  const { signedIn, isLoading, authModalOpen, setAuthModalOpen } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!signedIn) setAuthModalOpen(true);
  }, [isLoading, setAuthModalOpen, signedIn]);

  return (
    <main>
      <Outlet />
      <AuthModal open={authModalOpen} setOpen={setAuthModalOpen} />
    </main>
  );
}
