import { Button } from "@/components/ui/button";
import { Chat } from "@/types/chat.type";
import { ArrowLeft } from "lucide-react";
import ChatInfoDropdown from "./chat-info-dropdown";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

interface HeaderProps {
  chat: Chat;
}

export default function Header({ chat }: HeaderProps) {
  const navigate = useNavigate();

  const users = chat.users || [];
  const usersLength = users.length || 0;

  const handleBackToHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackToHome}
          className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {chat.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {usersLength} participante{usersLength > 1 && "s"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ChatInfoDropdown chat={chat} />
      </div>
    </div>
  );
}
