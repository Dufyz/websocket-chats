import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile, Paperclip, X, Check, Pencil } from "lucide-react";
import { Chat } from "@/types/chat.type";
import { useAuth } from "@/hooks/auth.hook";
import {
  useCreateMessage,
  useUpdateMessage,
} from "../../hooks/message-actions.hook";
import { Message } from "@/types/message.type";

interface InputAreaProps {
  chat: Chat;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isEditing: boolean;
  editingMessage: Message | null;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setEditingMessage: Dispatch<SetStateAction<Message | null>>;
}

export default function InputArea({
  chat,
  messagesEndRef,
  editingMessage,
  isEditing,
  setEditingMessage,
  setIsEditing,
}: InputAreaProps) {
  const { user } = useAuth();
  const { createMessage } = useCreateMessage();
  const { updateMessage } = useUpdateMessage();

  const [inputMessage, setInputMessage] = useState("");
  const [editingInputMessage, setEditingInputMessage] = useState(
    editingMessage?.message || ""
  );

  const handleMessageSubmit = async () => {
    if (!user) return;

    if (!isEditing && inputMessage.trim()) {
      await createMessage({
        chat_id: chat.id,
        user_id: user.id,
        message: inputMessage,
      });

      setInputMessage("");
      scrollToBottom();
    }

    if (isEditing && editingMessage && editingInputMessage.trim()) {
      await updateMessage(chat.id, editingMessage.id, {
        message: editingInputMessage,
      });

      handleCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingMessage(null);
    setEditingInputMessage("");
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      inline: "nearest",
      behavior: "instant",
    });
  }, [messagesEndRef]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleMessageSubmit();
    }
  };

  useEffect(() => {
    if (!isEditing) return;
    if (!editingMessage) return;

    setEditingInputMessage(editingMessage.message);

    return () => setEditingInputMessage("");
  }, [isEditing, editingMessage]);

  useEffect(() => {
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [messagesEndRef, chat.id, scrollToBottom]);

  return (
    <div className="flex flex-col w-full">
      <div className="px-4 py-2 bg-white dark:bg-[#202C33] border-t border-gray-200 dark:border-gray-700 flex items-end gap-4">
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

        <div className="flex-1 flex flex-col gap-4">
          {isEditing && (
            <div className="px-4 py-2 bg-emerald-700 dark:bg-emerald-800 flex items-center gap-4 rounded-md">
              <Pencil className="h-5 w-5 text-white" />
              <div className="flex flex-col">
                <p className="text-sm font-medium text-white">
                  Editando mensagem
                </p>
                <span className="text-sm text-white/80 line-clamp-1">
                  {editingMessage?.message}
                </span>
              </div>
            </div>
          )}

          {!isEditing && (
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Mensagem"
              className="h-10 bg-gray-100 dark:bg-[#2A3942] 
             border-gray-200 dark:border-none 
             text-gray-900 dark:text-gray-100 
             placeholder:text-gray-500 dark:placeholder:text-gray-400 
             focus-visible:ring-0 focus-visible:border-gray-300 
             dark:focus-visible:border-none"
              onKeyPress={handleKeyPress}
            />
          )}

          {isEditing && (
            <Input
              value={editingInputMessage}
              onChange={(e) => setEditingInputMessage(e.target.value)}
              placeholder="Editar mensagem"
              className="h-10 bg-gray-100 dark:bg-[#2A3942] 
               border-gray-200 dark:border-none 
               text-gray-900 dark:text-gray-100 
               placeholder:text-gray-500 dark:placeholder:text-gray-400 
               focus-visible:ring-0 focus-visible:border-gray-300 
               dark:focus-visible:border-none"
              onKeyPress={handleKeyPress}
            />
          )}
        </div>

        {isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancelEdit}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-400 
              dark:hover:text-white hover:bg-transparent"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        {!isEditing && (
          <Button
            disabled={!inputMessage.trim()}
            variant="ghost"
            size="icon"
            onClick={handleMessageSubmit}
            className="text-gray-500 dark:text-gray-400 
           hover:bg-gray-100 hover:text-gray-700 
           dark:hover:text-white dark:hover:bg-green-700 
           disabled:text-gray-400 dark:disabled:text-gray-500"
          >
            <Send className="h-6 w-6" />
          </Button>
        )}

        {isEditing && (
          <Button
            disabled={!editingInputMessage.trim()}
            variant="ghost"
            size="icon"
            onClick={handleMessageSubmit}
            className="text-gray-500 dark:text-gray-400 
            hover:bg-gray-100 hover:text-gray-700 
            dark:hover:text-white dark:hover:bg-green-700 
            disabled:text-gray-400 dark:disabled:text-gray-500"
          >
            <Check className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
