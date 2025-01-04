import { MessageBubble } from "@/pages/chat/components/message-bubble/message-bubble";
import { cn } from "@/lib/utils";
import { Chat } from "@/types/chat.type";
import { Dispatch, SetStateAction, useMemo, useRef } from "react";
import { useGetChatMessages } from "../../hooks/chat-fetchs.hook";
import { Loader2 } from "lucide-react";
import { Message } from "@/types/message.type";

interface ChatAreaProps {
  chat: Chat;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setEditingMessage: Dispatch<SetStateAction<Message | null>>;
}

// Light pattern
const lightPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`;

// Dark pattern
const darkPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`;

export default function ChatArea({
  chat,
  messagesEndRef,
  setEditingMessage,
  setIsEditing,
}: ChatAreaProps) {
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useGetChatMessages(
    { chat }
  );

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const totalMessages = chat.total_messages || 0;

  const messages = useMemo(
    () => (chat?.messages || []).sort((a, b) => a.id - b.id),
    [chat.messages]
  );

  async function loadMoreMessages() {
    if (!scrollAreaRef.current || !hasNextPage || isFetchingNextPage) return;

    const scrollTopBefore = scrollAreaRef.current.scrollTop;
    const scrollHeightBefore = scrollAreaRef.current.scrollHeight;

    await fetchNextPage();

    const scrollHeightAfter = scrollAreaRef.current.scrollHeight;
    scrollAreaRef.current.scrollTop =
      scrollTopBefore + (scrollHeightAfter - scrollHeightBefore) + 30;
  }

  function onScroll() {
    if (!scrollAreaRef.current || !hasNextPage || isFetchingNextPage) return;

    const scrollTop = scrollAreaRef.current.scrollTop;

    const messageHeightEstimate =
      scrollAreaRef.current.scrollHeight / totalMessages;

    if (scrollTop <= 20 * messageHeightEstimate) {
      loadMoreMessages();
    }
  }

  return (
    <div
      ref={scrollAreaRef}
      className={cn(
        "flex-1 p-4 transition-colors duration-200 overflow-auto",
        "bg-gray-50 dark:bg-[#0B141A]"
      )}
      style={{
        backgroundImage: "var(--pattern)",
        backgroundRepeat: "repeat",
        ["--pattern" as string]:
          "var(--tw-theme-pattern, var(--pattern-light))",
        ["--pattern-light" as string]: lightPattern,
        ["--pattern-dark" as string]: darkPattern,
      }}
      onScrollCapture={() => onScroll()}
    >
      {hasNextPage && (
        <div className="flex justify-center items-center py-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        </div>
      )}

      {messages.map((message) => {
        const messageUser = (chat?.users || []).find(
          (u) => u.id === message.user_id
        );

        if (!messageUser) return null;

        return (
          <MessageBubble
            key={message.id}
            user={messageUser}
            message={message}
            setIsEditing={setIsEditing}
            setEditingMessage={setEditingMessage}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
