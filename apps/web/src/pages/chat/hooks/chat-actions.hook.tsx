import { useAuth } from "@/hooks/auth.hook";
import {
  createChatSchema,
  CreateChatSchema,
  updateChatSchema,
  UpdateChatSchema,
} from "@/pages/chat/schemas/chat.schema";
import { useChatStore } from "@/pages/chat/stores/chat.store";
import { Chat } from "@/types/chat.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";

export function useCreateChat() {
  const { user } = useAuth();
  const createChatStore = useChatStore((state) => state.create);
  const joinChatStore = useChatStore((state) => state.joinChat);

  const defaultValues: CreateChatSchema = useMemo(
    () => ({
      id: v4(),
      admin_user_id: user?.id ?? "",
      name: "",
      category: "Bate-papo",
      description: null,
      created_at: new Date(),
      updated_at: new Date(),
    }),
    [user]
  );

  const form = useForm<CreateChatSchema>({
    resolver: zodResolver(createChatSchema),
    mode: "onChange",
    defaultValues,
  });

  function createChat(data: CreateChatSchema) {
    if (!user) return;

    createChatStore(data);
    joinChatStore(data.id, user);

    form.reset(defaultValues);
  }

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form, user?.id]);

  return { form, createChat };
}

export function useUpdateChat({ chat }: { chat: Chat }) {
  const updateChatStore = useChatStore((state) => state.update);

  const form = useForm<UpdateChatSchema>({
    resolver: zodResolver(updateChatSchema),
    mode: "onChange",
    values: chat,
  });

  function updateChat(data: UpdateChatSchema) {
    updateChatStore(data);
  }

  return { form, updateChat };
}

export function useDeleteChat() {
  const deleteChatStore = useChatStore((state) => state.delete);

  function deleteChat(id: string) {
    deleteChatStore(id);
  }

  return { deleteChat };
}

export function useJoinChat() {
  const { user } = useAuth();
  const joinChatStore = useChatStore((state) => state.joinChat);

  function joinChat(chatId: string) {
    if (!user) return;

    joinChatStore(chatId, user);
  }

  return { joinChat };
}

export function useLeaveChat() {
  const { user } = useAuth();
  const leaveChatStore = useChatStore((state) => state.leaveChat);

  function leaveChat(chatId: string, userId: string) {
    if (!user) return;

    leaveChatStore(chatId, userId);
  }

  return { leaveChat };
}
