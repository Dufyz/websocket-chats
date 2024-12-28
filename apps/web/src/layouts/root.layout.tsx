import { Outlet } from "react-router-dom";

import "@/styles/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeProvider from "@/providers/theme.provider";
import AuthProvider from "@/providers/auth.provider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
