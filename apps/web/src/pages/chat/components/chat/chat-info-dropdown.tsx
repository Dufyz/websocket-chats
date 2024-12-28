import { Button } from "@/components/ui/button";
import { Chat } from "@/types/chat.type";
import { Info, Menu, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/auth.hook";
import { useLeaveChat } from "../../hooks/chat-actions.hook";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/user.type";

interface ChatInfoDropdownProps {
  chat: Chat;
}

export default function ChatInfoDropdown({ chat }: ChatInfoDropdownProps) {
  const { user } = useAuth();
  const { leaveChat } = useLeaveChat();
  const navigate = useNavigate();

  const isAdmin = user?.id === chat.admin_user_id;
  const users = chat.users || [];

  function handleLeaveChat() {
    if (!user) return;
    leaveChat(chat.id, user.id);
    navigate("/");
  }

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
          <TabsList className="w-16 flex flex-col h-full flex-shrink-0 items-center justify-start bg-gray-50 dark:bg-zinc-900 p-2 gap-4">
            <TabsTrigger
              value="overview"
              className="w-full aspect-square flex items-center justify-center data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 rounded-md"
            >
              <Info className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="w-full aspect-square flex items-center justify-center data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 rounded-md"
            >
              <Users className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] flex-1">
            <TabsContent value="overview" className="m-0">
              <OverviewTab
                chat={chat}
                isAdmin={isAdmin}
                handleLeaveChat={handleLeaveChat}
              />
            </TabsContent>

            <TabsContent value="members" className="m-0">
              <MembersTab users={users} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface OverviewTabProps {
  chat: Chat;
  isAdmin: boolean;
  handleLeaveChat: () => void;
}

function OverviewTab({ chat, isAdmin, handleLeaveChat }: OverviewTabProps) {
  const users = chat.users || [];

  return (
    <div className="w-[350px] h-full flex flex-col items-center">
      <div className="w-full p-6 flex flex-col items-center text-center border-b dark:border-zinc-800">
        <Avatar className="w-28 h-28 mb-4">
          {/* <AvatarImage src={chat.avatar_url} /> */}
          <AvatarFallback className="text-4xl bg-emerald-500">
            {chat.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
          {chat.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          {users.length} participantes
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

          {chat.description && (
            <div>
              <div className="text-gray-500 dark:text-zinc-400 text-xs font-medium mb-1">
                Descrição
              </div>
              <div className="text-sm text-gray-900 dark:text-white">
                {chat.description}
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-gray-200 dark:bg-zinc-800" />

        {!isAdmin && (
          <div className="pt-4">
            <Button
              onClick={handleLeaveChat}
              variant="destructive"
              className="text-sm h-11 w-full"
            >
              Sair do grupo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface MembersTabProps {
  users: User[];
}

function MembersTab({ users }: MembersTabProps) {
  return (
    <div className="w-[350px] p-4">
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
