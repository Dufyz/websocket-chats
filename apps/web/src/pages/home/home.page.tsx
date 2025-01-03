import JoinChatCard, {
  JoinChatCardSkeleton,
} from "@/pages/chat/components/join-chat-card";
import CreateChatModal from "@/pages/chat/components/create-chat-modal";
import Header from "./components/header";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetChats } from "../chat/hooks/chat-fetchs.hook";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 30;

export default function HomePage() {
  const { setSearch, chats, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetChats();

  const [liveSearch, setLiveSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(liveSearch);
    }, 500);
    return () => clearTimeout(timeout);
  }, [liveSearch, setSearch]);

  return (
    <div className="min-h-screen dark:bg-black text-white bg-white">
      <Header />
      <main className="p-4 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar salas de conversa..."
              className="pl-10 dark:bg-gray-900 dark:border-gray-800"
              value={liveSearch}
              onChange={(e) => setLiveSearch(e.target.value)}
            />
          </div>
          <CreateChatModal />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chats.map((chat, index) => (
            <JoinChatCard chat={chat} key={chat.id || index} />
          ))}
          {isFetchingNextPage &&
            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <JoinChatCardSkeleton key={`skeleton-${index}`} />
            ))}
        </div>
        {hasNextPage && !isFetchingNextPage && (
          <div className="w-full flex items-center justify-center">
            <div>
              <Button onClick={() => fetchNextPage()} className="w-full">
                <Plus className="h-5 w-5" />
                <p>Carregar mais</p>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
