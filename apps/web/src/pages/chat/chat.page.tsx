import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth.hook";
import { useCreateMessage } from "@/pages/chat/hooks/message-actions.hook";
import { useChatStore } from "@/pages/chat/stores/chat.store";
import { v4 } from "uuid";
import SignInModal from "@/components/auth/sign-in-modal";
import { User } from "@/types/user.type";
import { Chat } from "./components/chat";
import { Chat as TypeChat } from "@/types/chat.type";

export default function ChatPage() {
  const { user, signedIn } = useAuth();
  const { createMessage } = useCreateMessage();
  const { id: chatId } = useParams();
  const navigate = useNavigate();

  const [signInOpen, setSignInOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chats = useChatStore((state) => state.chats);
  const chat = chats.find((c) => c.id === chatId) as TypeChat;
  const messages = useMemo(() => chat.messages || [], [chat.messages]);
  const users = [...(chat.users || []), user as User];

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

  const handleBackToHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (signedIn) return;
    setSignInOpen(true);
  }, [signedIn]);

  useEffect(() => {
    if (!signInOpen && !signedIn) return handleBackToHome();
  }, [handleBackToHome, signInOpen, signedIn]);

  useEffect(() => {
    const isLastMessageMine =
      messages[messages.length - 1]?.user_id === user?.id;
    if (!isLastMessageMine) return;
    scrollToBottom();
  }, [messages, user?.id]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col">
        <Chat.Header chat={chat} onBack={handleBackToHome} />
        <Chat.ChatArea
          messages={messages}
          users={users}
          messagesEndRef={messagesEndRef}
        />
        <Chat.InputArea onSend={handleSendMessage} />
      </div>
      <SignInModal open={signInOpen} setOpen={setSignInOpen} />
    </div>
  );
}
