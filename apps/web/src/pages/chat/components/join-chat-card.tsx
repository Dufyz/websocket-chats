import { Users, MessageSquare, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Chat } from "@/types/chat.type";
import { useAuth } from "@/hooks/auth.hook";
import SignInModal from "../../../components/auth/sign-in-modal";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useJoinChat } from "../hooks/chat-actions.hook";

interface JoinChatCardProps {
  chat: Chat;
}

const MAX_USERS = 6;

export default function JoinChatCard({ chat }: JoinChatCardProps) {
  const { user, signedIn } = useAuth();
  const { joinChat } = useJoinChat();
  const navigate = useNavigate();

  const [signInOpen, setSignInOpen] = useState(false);

  const chatUsersLength = chat.users?.length || 0;
  const chatMessagesLength = chat.messages?.length || 0;
  const users = chat.users || [];
  const usersLength = users.length;

  const iAmChatMember = chat.users?.some((u) => u.id === user?.id);

  function handleJoinChat() {
    if (!signedIn) {
      setSignInOpen(true);
      return;
    }

    if (!iAmChatMember) {
      joinChat(chat.id);
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
            {iAmChatMember && (
              <div>
                <Pin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            )}
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
              {chatUsersLength || 0} participante
              {(chatUsersLength > 1 || chatUsersLength === 0) && "s"}
            </span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{chatMessagesLength}</span>
          </div>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleJoinChat}
        >
          {iAmChatMember ? "Entrar" : "Participar"}
        </Button>
      </div>

      {usersLength > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex -space-x-2">
            {users.slice(0, MAX_USERS).map((user, index) => (
              <Avatar
                className="h-6 w-6 border-2 border-white dark:border-gray-900"
                key={index}
              >
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-[11px]">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {usersLength > MAX_USERS && (
              <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-center text-xs">
                +{usersLength - MAX_USERS}
              </div>
            )}
          </div>
        </div>
      )}

      <SignInModal open={signInOpen} setOpen={setSignInOpen} />
    </div>
  );
}
