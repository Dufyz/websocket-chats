import { Message } from "@/types/message.type";
import { User } from "@/types/user.type";
import { MessageContextMenu } from "./message-bubble-context-menu";
import { MessageDropdown } from "./message-bubble-dropdown";
import { cn } from "@/lib/utils";
import {
  useDeleteMessage,
  useUpdateMessage,
} from "../../hooks/message-actions.hook";
import { useAuth } from "@/hooks/auth.hook";

interface MessageBubbleProps {
  message: Message;
  user: User;
}

export function MessageBubble({ message, user }: MessageBubbleProps) {
  const { user: loggedInUser } = useAuth();
  const { updateMessage } = useUpdateMessage();
  const { deleteMessage } = useDeleteMessage();

  const isOwnMessage = message.user_id === loggedInUser?.id;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.message);
  };

  const handleUpdateMessage = () => {};

  const handleDeleteMessage = () => {
    deleteMessage(message.chat_id, message.id);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div
      className={cn("group pb-2 px-4 flex items-center gap-2", {
        "justify-end": isOwnMessage,
        "justify-start": !isOwnMessage,
      })}
    >
      <MessageDropdown
        isOwnMessage={isOwnMessage}
        onDelete={handleDeleteMessage}
        onCopy={handleCopyMessage}
        onUpdate={handleUpdateMessage}
      />
      <MessageContextMenu
        isOwnMessage={isOwnMessage}
        onDelete={handleDeleteMessage}
        onCopy={handleCopyMessage}
        onUpdate={handleUpdateMessage}
      >
        <div
          className={cn(
            "relative max-w-[65%] rounded-lg px-2 py-1.5",
            isOwnMessage
              ? "bg-emerald-600 dark:bg-[#005C4B] text-white rounded-tr-none"
              : "bg-gray-200 dark:bg-[#202C33] text-gray-900 dark:text-white rounded-tl-none"
          )}
        >
          {!isOwnMessage && (
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500">
              {user.name}
            </p>
          )}
          <p className="text-sm break-words pr-6 pb-1">{message.message}</p>
          <div className="flex items-center justify-end gap-1 -mb-1">
            <span className="text-[11px] text-gray-600 dark:text-gray-300">
              {formatTime(message.created_at)}
            </span>
          </div>
          <div
            className={cn(
              "absolute top-0 w-4 h-4",
              isOwnMessage
                ? "-right-2 [clip-path:polygon(0_0,0%_100%,100%_0)] bg-emerald-600 dark:bg-[#005C4B]"
                : "-left-2 [clip-path:polygon(0_0,100%_0,100%_100%)] bg-gray-200 dark:bg-[#202C33]"
            )}
          />
        </div>
      </MessageContextMenu>
    </div>
  );
}
