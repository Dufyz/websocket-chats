import { useAuth } from "@/hooks/auth.hook";
import {
  createChatSchema,
  CreateChatSchema,
  updateChatSchema,
  UpdateChatSchema,
} from "@/pages/chat/schemas/chat.schema";
import { useChatStore } from "@/pages/chat/stores/chat.store";
import {
  deleteChat as queryDeleteChat,
  postChat,
  patchChat,
} from "@/queries/chat.queries";
import { Chat } from "@/types/chat.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function useCreateChat() {
  const { user } = useAuth();

  const createChatStore = useChatStore((state) => state.create);

  const defaultValues: CreateChatSchema = useMemo(
    () => ({
      admin_user_id: user?.id ?? -1,
      name: "",
      category: "chat",
      description: null,
    }),
    [user]
  );

  const form = useForm<CreateChatSchema>({
    resolver: zodResolver(createChatSchema),
    mode: "onChange",
    defaultValues,
  });

  async function createChat(data: CreateChatSchema): Promise<Chat | undefined> {
    try {
      if (!user) return;

      const { chat } = await postChat(data);

      createChatStore(chat);

      form.reset(defaultValues);

      return chat;
    } catch (error) {
      console.error(error);
    }
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

  async function updateChat(data: UpdateChatSchema) {
    try {
      const { chat: updatedChat } = await patchChat(chat.id, data);

      updateChatStore(updatedChat);
    } catch (e) {
      console.error(e);
    }
  }

  return { form, updateChat };
}

export function useDeleteChat() {
  const deleteChatStore = useChatStore((state) => state.delete);
  const navigate = useNavigate();

  async function deleteChat(id: number) {
    try {
      await queryDeleteChat(id);

      navigate("/");

      deleteChatStore(id);
    } catch (error) {
      console.error(error);
    }
  }

  return { deleteChat };
}