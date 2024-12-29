import { useChatStore } from "@/pages/chat/stores/chat.store";
import { getChats } from "@/queries/chat.queries";
import { Chat } from "@/types/chat.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function useGetChats() {
  const [search, setSearch] = useState<string>("");

  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["chats", search],
    queryFn: async ({ pageParam = null }: { pageParam: number | null }) => {
      try {
        const { data } = await getChats(search, pageParam, 30);

        const chats: Chat[] = data.chats.map((r) => ({
          ...r.chat,
          total_users: r.total_users,
          total_messages: r.total_messages,
        }));

        setChats(chats);

        return data;
      } catch (e) {
        console.error(e);
        throw new Error("Failed to fetch chats");
      }
    },
    getNextPageParam: (lastPage) => lastPage.pagination.next_cursor,
    initialPageParam: null,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat?.description?.toLowerCase().includes(search.toLowerCase())
  );

  return {
    search,
    setSearch,
    chats: filteredChats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
