import { Outlet } from "react-router-dom";

import "@/styles/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeProvider from "@/providers/theme.provider";
import AuthProvider from "@/providers/auth.provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SocketProvider from "@/providers/socket.provider";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <AuthProvider>
            <TooltipProvider>
              <Outlet />
            </TooltipProvider>
          </AuthProvider>
        </SocketProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
