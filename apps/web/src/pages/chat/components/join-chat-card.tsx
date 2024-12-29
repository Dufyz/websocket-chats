import { Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Chat } from "@/types/chat.type";
import { useAuth } from "@/hooks/auth.hook";
import { useState } from "react";
import AuthModal from "../../../components/auth/auth-modal";
import { Skeleton } from "@/components/ui/skeleton";

interface JoinChatCardProps {
  chat: Chat;
}

export default function JoinChatCard({ chat }: JoinChatCardProps) {
  const { signedIn } = useAuth();
  const navigate = useNavigate();

  const [signInOpen, setSignInOpen] = useState(false);

  const totalUsers = chat.total_users || 0;
  const totalMessages = chat.total_messages || 0;

  function handleJoinChat() {
    if (!signedIn) {
      setSignInOpen(true);
      return;
    }

    navigate(`/chat/${chat.id}`);
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex items-start justify-between">
            <div className="flex flex-col items-start justify-center gap-2">
              {chat.category && (
                <Badge className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                  {chat.category}
                </Badge>
              )}
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {chat.name}
              </h3>
            </div>
          </div>
          {chat.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {chat.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {totalUsers || 0} participante
              {(totalUsers > 1 || totalUsers === 0) && "s"}
            </span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{totalMessages}</span>
          </div>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleJoinChat}
        >
          Participar
        </Button>
      </div>

      <AuthModal open={signInOpen} setOpen={setSignInOpen} />
    </div>
  );
}

export function JoinChatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex items-start justify-between">
            <div className="flex flex-col items-start justify-center gap-2">
              <Skeleton className="w-16 h-6 rounded-md" />
              <Skeleton className="w-48 h-5 rounded-md" />
            </div>
          </div>
          <Skeleton className="w-full h-4 rounded-md" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Skeleton className="w-20 h-4 rounded-md" />
          </div>
          <div className="flex items-center">
            <Skeleton className="w-16 h-4 rounded-md" />
          </div>
        </div>
        <Skeleton className="w-24 h-8 rounded-md" />
      </div>
    </div>
  );
}
