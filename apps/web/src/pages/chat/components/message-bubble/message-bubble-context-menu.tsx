import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { MessageMenu } from "./message-bubble-menu";

interface MessageContextMenuProps {
  children: React.ReactNode;
  isOwnMessage: boolean;
  onCopy?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  onInfo?: () => void;
}

export function MessageContextMenu({
  children,
  ...menuProps
}: MessageContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64 bg-[#233138] border-none text-white">
        <MessageMenu
          {...menuProps}
          MenuItemComponent={ContextMenuItem}
          SeparatorComponent={ContextMenuSeparator}
        />
      </ContextMenuContent>
    </ContextMenu>
  );
}
