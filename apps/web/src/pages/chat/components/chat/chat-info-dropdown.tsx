import { Button } from "@/components/ui/button";
import { Chat } from "@/types/chat.type";
import { Info, Menu, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/auth.hook";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDeleteChat, useUpdateChat } from "../../hooks/chat-actions.hook";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UpdateChatSchema } from "../../schemas/chat.schema";

interface ChatInfoDropdownProps {
  chat: Chat;
}

export default function ChatInfoDropdown({ chat }: ChatInfoDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white p-0 flex flex-row border border-gray-200 dark:border-gray-800"
        align="end"
      >
        <Tabs defaultValue="overview" className="w-full flex flex-row">
          <TabsList className="w-16 flex flex-col h-full flex-shrink-0 items-center justify-start bg-gray-50 dark:bg-zinc-900 p-2 gap-4 border-r">
            <TabsTrigger
              value="overview"
              className="w-full aspect-square flex items-center justify-center data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 rounded-md"
            >
              <Info className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] flex-1">
            <TabsContent value="overview" className="m-0">
              <OverviewTab chat={chat} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface OverviewTabProps {
  chat: Chat;
}

function OverviewTab({ chat }: OverviewTabProps) {
  const { user } = useAuth();
  const { deleteChat } = useDeleteChat();
  const { form, updateChat } = useUpdateChat({ chat });

  const [isEditing, setIsEditing] = useState(false);

  const isAdmin = user?.id === chat.admin_user_id;
  const totalUsers = chat.total_users || 0;

  async function onSubmit(data: UpdateChatSchema) {
    await updateChat(data);
    setIsEditing(false);
  }

  return (
    <div className="w-[350px] h-full flex flex-col items-center">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="w-full p-6 flex flex-col items-center text-center border-b dark:border-zinc-800">
          <Avatar className="w-28 h-28 mb-4">
            <AvatarFallback className="text-4xl bg-emerald-500">
              {chat.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            {isEditing ? (
              <Input
                {...form.register("name")}
                className="text-xl font-semibold mb-1 text-gray-900 dark:text-white"
              />
            ) : (
              <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
                {form.getValues("name")}
              </h2>
            )}
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {totalUsers} participantes
          </p>
        </div>

        <div className="w-full p-4 space-y-6">
          <div className="space-y-4">
            <div>
              <div className="text-gray-500 dark:text-zinc-400 text-xs font-medium mb-1">
                Criado
              </div>
              <div className="text-sm text-gray-900 dark:text-white">
                12/05/2018 10:07
              </div>
            </div>

            <div>
              <div className="text-gray-500 dark:text-zinc-400 text-xs font-medium mb-1">
                Descrição
              </div>
              <div>
                {isEditing ? (
                  <Textarea
                    {...form.register("description")}
                    className="text-sm text-gray-900 dark:text-white"
                  />
                ) : (
                  <div className="text-sm text-gray-900 dark:text-white">
                    {form.getValues("description")}
                  </div>
                )}
              </div>
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {isAdmin && (
              <>
                {isEditing && (
                  <Button type="submit" variant="default" className="w-full">
                    Salvar alterações
                  </Button>
                )}
                {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <p>Editar chat</p>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={() => deleteChat(chat.id)}
                >
                  Excluir chat
                </Button>
              </>
            )}
          </div>

          <Separator className="bg-gray-200 dark:bg-zinc-800" />
        </div>
      </form>
    </div>
  );
}
