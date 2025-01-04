import { Copy, Trash2, Pencil } from "lucide-react";

interface MessageMenuItemsProps {
  isOwnMessage: boolean;
  onCopy?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  MenuItemComponent: React.ComponentType<{
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
  }>;
  SeparatorComponent: React.ComponentType<{
    className?: string;
  }>;
}

export function MessageMenu({
  isOwnMessage,
  onCopy,
  onDelete,
  onUpdate,
  MenuItemComponent,
  SeparatorComponent,
}: MessageMenuItemsProps) {
  const itemClassName =
    "gap-2 focus:bg-[#182229] focus:text-white cursor-pointer";

  return (
    <>
      <MenuItemComponent onClick={onCopy} className={itemClassName}>
        <Copy className="h-4 w-4" />
        <span>Copiar</span>
      </MenuItemComponent>
      {isOwnMessage && (
        <>
          <SeparatorComponent className="bg-[#182229]" />
          <MenuItemComponent onClick={onUpdate} className={`${itemClassName}`}>
            <Pencil className="h-4 w-4" />
            <span>Editar</span>
          </MenuItemComponent>
          <MenuItemComponent
            onClick={onDelete}
            className={`${itemClassName} text-red-500 focus:text-red-500`}
          >
            <Trash2 className="h-4 w-4" />
            <span>Apagar</span>
          </MenuItemComponent>
        </>
      )}
    </>
  );
}
