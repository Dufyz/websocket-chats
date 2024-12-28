import JoinChatCard from "@/pages/chat/components/join-chat-card";
import CreateChatModal from "@/pages/chat/components/create-chat-modal";
import Header from "./components/header";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/pages/chat/stores/chat.store";
import sortChats from "../chat/utils/sort-chats";
import { useAuth } from "@/hooks/auth.hook";

export default function HomePage() {
  const { user } = useAuth();

  const chats = sortChats(
    useChatStore((state) => state.chats),
    user?.id || ""
  );

  return (
    <div className="min-h-screen dark:bg-black text-white bg-white">
      <Header />
      <main className="p-4 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search chat rooms..."
              className="pl-10 dark:bg-gray-900 dark:border-gray-800"
            />
          </div>
          <CreateChatModal />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chats.map((chat, index) => (
            <JoinChatCard key={index} chat={chat} />
          ))}
        </div>
      </main>
    </div>
  );
}
