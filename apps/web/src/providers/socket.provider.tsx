import { SocketContext } from "@/contexts/socket.context";
import { SocketData } from "@/types/socket.type";
import { ReactNode, useCallback, useEffect, useState } from "react";

interface SocketProviderProps {
  children: ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [currentRooms, setCurrentRooms] = useState<Set<string>>(new Set());

  const joinRoom = useCallback(
    (room_id: string) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;

      const event: SocketData = {
        type: "join",
        room_id,
      };

      socket.send(JSON.stringify(event));

      setCurrentRooms((prev) => new Set(prev).add(room_id));

      console.log("Tentando entrar na sala:", event);
    },
    [socket]
  );

  const leaveRoom = useCallback(
    (room_id: string) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;

      const event: SocketData = {
        type: "leave",
        room_id,
      };

      socket.send(JSON.stringify(event));

      setCurrentRooms((prev) => {
        const newRooms = new Set(prev);
        newRooms.delete(room_id);
        return newRooms;
      });

      console.log("Saindo da sala:", event);
    },
    [socket]
  );

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/api/web-socket");

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
      setCurrentRooms(new Set());
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const value = {
    socket,
    connected,
    currentRooms,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
