import { createContext } from "react";

interface SocketContextProps {
  socket: WebSocket | null;
  connected: boolean;
  currentRooms: Set<string>;
  joinRoom: (room_id: string) => void;
  leaveRoom: (room_id: string) => void;
}

export const SocketContext = createContext<SocketContextProps>(
  {} as SocketContextProps
);
