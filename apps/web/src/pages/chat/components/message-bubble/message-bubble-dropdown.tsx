import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { MessageMenu } from "./message-bubble-menu";
import { cn } from "@/lib/utils";

interface MessageDropdownProps {
  isOwnMessage: boolean;
  onCopy?: () => void;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export function MessageDropdown(props: MessageDropdownProps) {
  const { isOwnMessage } = props;

  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "hover:bg-[#202C33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B141A] focus:ring-[#00A884]",
            {
              "-order-last": isOwnMessage,
              "-order-first": !isOwnMessage,
            }
          )}
        >
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isOwnMessage ? "end" : "start"}
        className="w-64 bg-[#233138] border-none text-white"
      >
        <MessageMenu
          {...props}
          MenuItemComponent={DropdownMenuItem}
          SeparatorComponent={DropdownMenuSeparator}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
