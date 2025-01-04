import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth.hook";
import { useChatStore } from "@/pages/chat/stores/chat.store";
import { Chat } from "./components/chat";
import { useSocket } from "@/hooks/socket.hook";
import { useSocketChat } from "./hooks/chat-actions.hook";
import { Message } from "@/types/message.type";

export default function ChatPage() {
  useSocketChat();
  const { joinRoom, leaveRoom } = useSocket();
  const { signedIn, authModalOpen, setAuthModalOpen } = useAuth();
  const { id: chatId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chats = useChatStore((state) => state.chats);
  const chat = chats.find((c) => c.id === Number(chatId));

  useEffect(() => {
    if (signedIn) return;
    if (authModalOpen) return;

    setAuthModalOpen(true);
  }, [authModalOpen, setAuthModalOpen, signedIn]);

  useEffect(() => {
    if (!chat?.id) return;

    joinRoom(`chat_${chat.id}`);

    return () => {
      leaveRoom(`chat_${chat.id}`);
    };
  }, [chat?.id, joinRoom, leaveRoom]);

  if (!chat) return null;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col">
        <Chat.Header chat={chat} />
        <Chat.ChatArea
          chat={chat}
          messagesEndRef={messagesEndRef}
          setIsEditing={setIsEditing}
          setEditingMessage={setEditingMessage}
        />
        <Chat.InputArea
          chat={chat}
          messagesEndRef={messagesEndRef}
          isEditing={isEditing}
          editingMessage={editingMessage}
          setIsEditing={setIsEditing}
          setEditingMessage={setEditingMessage}
        />
      </div>
    </div>
  );
}
