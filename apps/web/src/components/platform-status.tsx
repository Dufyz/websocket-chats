import { useSocket } from "@/hooks/socket.hook";
import { cn } from "@/lib/utils";

export default function PlatformStatus() {
  const { connected } = useSocket();

  return (
    <div className="flex items-center gap-2 px-2">
      <div
        className={cn("w-2 h-2 rounded-full", {
          "bg-green-500": connected,
          "bg-red-500": !connected,
        })}
      />
      <span className="text-sm">
        {connected && "Conectado"}
        {!connected && "Desconectado"}
      </span>
    </div>
  );
}
