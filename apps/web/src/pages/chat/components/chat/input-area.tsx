import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile, Paperclip } from "lucide-react";
import { Chat } from "@/types/chat.type";
import { useAuth } from "@/hooks/auth.hook";
import { useCreateMessage } from "../../hooks/message-actions.hook";

interface InputAreaProps {
  chat: Chat;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function InputArea({ chat, messagesEndRef }: InputAreaProps) {
  const { user } = useAuth();
  const { createMessage } = useCreateMessage();

  const [inputMessage, setInputMessage] = useState("");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      inline: "end",
      block: "end",
      behavior: "instant",
    });
  }, [messagesEndRef]);

  async function handleSendMessage() {
    if (!user) return;
    if (!inputMessage.trim()) return;

    await createMessage({
      chat_id: chat.id,
      user_id: user.id,
      message: inputMessage,
    });

    setInputMessage("");

    scrollToBottom();
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeout);
  }, [messagesEndRef, chat.id, scrollToBottom]);

  return (
    <div className="px-4 py-2 bg-white dark:bg-[#202C33] border-t border-gray-200 dark:border-gray-700 flex items-center gap-4">
      <Button
        disabled
        variant="ghost"
        size="icon"
        className="text-gray-500 dark:text-gray-400 
          hover:bg-gray-100 hover:text-gray-700 
          dark:hover:text-white dark:hover:bg-green-700 
          disabled:text-gray-400 dark:disabled:text-gray-500"
      >
        <Smile className="h-6 w-6" />
      </Button>
      <Button
        disabled
        variant="ghost"
        size="icon"
        className="text-gray-500 dark:text-gray-400 
          hover:bg-gray-100 hover:text-gray-700 
          dark:hover:text-white dark:hover:bg-green-700 
          disabled:text-gray-400 dark:disabled:text-gray-500"
      >
        <Paperclip className="h-6 w-6" />
      </Button>
      <Input
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Message"
        className="flex-1 bg-gray-100 dark:bg-[#2A3942] 
          border-gray-200 dark:border-none 
          text-gray-900 dark:text-gray-100 
          placeholder:text-gray-500 dark:placeholder:text-gray-400 
          focus-visible:ring-0 focus-visible:border-gray-300 
          dark:focus-visible:border-none"
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <Button
        disabled={!inputMessage.trim()}
        variant="ghost"
        size="icon"
        onClick={handleSendMessage}
        className="text-gray-500 dark:text-gray-400 
          hover:bg-gray-100 hover:text-gray-700 
          dark:hover:text-white dark:hover:bg-green-700 
          disabled:text-gray-400 dark:disabled:text-gray-500"
      >
        <Send className="h-6 w-6" />
      </Button>
    </div>
  );
}
