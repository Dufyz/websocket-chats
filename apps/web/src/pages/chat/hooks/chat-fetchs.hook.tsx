import { useChatStore } from "@/pages/chat/stores/chat.store";
import { getChats } from "@/queries/chat.queries";
import { getMessages } from "@/queries/message.queries";
import { Chat } from "@/types/chat.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useGetChats() {
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
          users: r.users,
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

export function useGetChatMessages({ chat }: { chat: Chat }) {
  const setChatMessages = useChatStore((state) => state.setChatMessages);

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["chat-messages", chat.id],
    queryFn: async ({ pageParam = null }: { pageParam: number | null }) => {
      try {
        const { data } = await getMessages(chat.id, pageParam, 30);

        setChatMessages(chat.id, data.messages);

        return data;
      } catch (e) {
        console.error(e);
        throw new Error("Failed to fetch messages");
      }
    },
    getNextPageParam: (lastPage) => lastPage.pagination.next_cursor,
    initialPageParam: null,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
