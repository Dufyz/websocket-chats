import AuthModal from "@/components/auth/auth-modal";
import PlatformStatus from "@/components/platform-status";
import { useAuth } from "@/hooks/auth.hook";
import ToggleTheme from "@/components/toggle-theme";
import { UserDropdown } from "@/components/auth/user-dropdown";
import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { signedIn, user } = useAuth();

  const [signInOpen, setSignInOpen] = useState(false);

  return (
    <nav className="border-b dark:border-gray-800 text-black dark:text-white">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center justify-center gap-2">
          {signedIn && user && <UserDropdown user={user} />}
          {!signedIn && (
            <AuthModal open={signInOpen} setOpen={setSignInOpen}>
              <Button variant="ghost" size="sm">
                <LogIn className="h-4 w-4" />
                <p>Entrar</p>
              </Button>
            </AuthModal>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ToggleTheme />
          <PlatformStatus />
        </div>
      </div>
    </nav>
  );
}
