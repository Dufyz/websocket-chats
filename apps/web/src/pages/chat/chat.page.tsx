import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth.hook";
import { useCreateMessage } from "@/pages/chat/hooks/message-actions.hook";
import { useChatStore } from "@/pages/chat/stores/chat.store";
import { v4 } from "uuid";
import { Chat } from "./components/chat";
import { Chat as TypeChat } from "@/types/chat.type";

export default function ChatPage() {
  const { user, signedIn, authModalOpen, setAuthModalOpen } = useAuth();
  const { createMessage } = useCreateMessage();
  const { id: chatId } = useParams();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chats = useChatStore((state) => state.chats);
  const chat = chats.find((c) => c.id === Number(chatId)) as TypeChat;
  const messages = useMemo(() => chat?.messages || [], [chat.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (message: string) => {
    if (!user) return;

    createMessage({
      id: v4(),
      chat_id: chat.id,
      user_id: user.id,
      message,
      created_at: new Date(),
      updated_at: new Date(),
    });
  };

  useEffect(() => {
    const isLastMessageMine =
      messages[messages.length - 1]?.user_id === user?.id;
    if (!isLastMessageMine) return;
    scrollToBottom();
  }, [messages, user?.id]);

  useEffect(() => {
    if (signedIn) return;
    if (authModalOpen) return;

    setAuthModalOpen(true);
  }, [authModalOpen, setAuthModalOpen, signedIn]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col">
        <Chat.Header chat={chat} />
        <Chat.ChatArea messages={messages} messagesEndRef={messagesEndRef} />
        <Chat.InputArea onSend={handleSendMessage} />
      </div>
    </div>
  );
}
