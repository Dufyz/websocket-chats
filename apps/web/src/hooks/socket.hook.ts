import { SocketContext } from "@/contexts/socket.context";
import { useContext } from "react";

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
}
