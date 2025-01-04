import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth.hook";
import { useChatStore } from "@/pages/chat/stores/chat.store";
import { Chat } from "./components/chat";
import { useSocket } from "@/hooks/socket.hook";
import { useSocketChat } from "./hooks/chat-actions.hook";
import { Message } from "@/types/message.type";
import { getChatById } from "@/queries/chat.queries";

export default function ChatPage() {
  const { joinRoom, leaveRoom } = useSocket();
  const { signedIn, authModalOpen, setAuthModalOpen } = useAuth();
  const { id: chatId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useSocketChat({ messagesEndRef, scrollAreaRef });

  const createChat = useChatStore((state) => state.create);
  const chats = useChatStore((state) => state.chats);
  const chat = chats.find((c) => c.id === Number(chatId));

  const getChat = useCallback(async () => {
    try {
      const { chat, users, total_messages, total_users } = await getChatById(
        Number(chatId)
      );

      if (!chat) return;

      createChat({
        ...chat,
        users: users,
        total_messages,
        total_users,
      });
    } catch (e) {
      console.error(e);
    }
  }, [chatId, createChat]);

  useEffect(() => {
    if (signedIn) return setAuthModalOpen(false);
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

  useEffect(() => {
    if (!chatId) return;
    if (chat?.id === Number(chatId)) return;

    getChat();
  }, [chat, chatId, getChat]);

  if (!chat) return null;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col">
        <Chat.Header chat={chat} />
        <Chat.ChatArea
          chat={chat}
          scrollAreaRef={scrollAreaRef}
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
