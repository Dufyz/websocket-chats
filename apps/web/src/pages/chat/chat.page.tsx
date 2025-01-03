import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth.hook";
import { useChatStore } from "@/pages/chat/stores/chat.store";
import { Chat } from "./components/chat";

export default function ChatPage() {
  const { signedIn, authModalOpen, setAuthModalOpen } = useAuth();
  const { id: chatId } = useParams();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chats = useChatStore((state) => state.chats);
  const chat = chats.find((c) => c.id === Number(chatId));

  useEffect(() => {
    if (signedIn) return;
    if (authModalOpen) return;

    setAuthModalOpen(true);
  }, [authModalOpen, setAuthModalOpen, signedIn]);

  if (!chat) return null;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col">
        <Chat.Header chat={chat} />
        <Chat.ChatArea chat={chat} messagesEndRef={messagesEndRef} />
        <Chat.InputArea chat={chat} messagesEndRef={messagesEndRef} />
      </div>
    </div>
  );
}
