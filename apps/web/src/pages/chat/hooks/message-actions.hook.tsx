import { useChatStore } from "@/pages/chat/stores/chat.store";
import {
  patchMessage,
  postMessage,
  deleteMessage as queryDeleteMessage,
} from "@/queries/message.queries";
import {
  CreateMessageSchema,
  UpdateMessageSchema,
} from "../schemas/message.schema";
import { useAuth } from "@/hooks/auth.hook";

export function useCreateMessage() {
  const { user } = useAuth();
  const chats = useChatStore((state) => state.chats);
  const createMessageStore = useChatStore((state) => state.createMessage);
  const addUserToChat = useChatStore((state) => state.addUserToChat);

  async function createMessage(data: CreateMessageSchema) {
    if (!user) return;
    const { message } = await postMessage(data);

    createMessageStore(message.chat_id, message);

    const chat = chats.find((chat) => chat.id === message.chat_id);
    const chatUsers = chat?.users || [];

    const isUserAlreadyInChat = chatUsers.some(
      (user) => user.id === data.user_id
    );

    if (isUserAlreadyInChat) return;

    addUserToChat(message.chat_id, user);
  }

  return { createMessage };
}

export function useUpdateMessage() {
  const updateMessageStore = useChatStore((state) => state.updateMessage);

  async function updateMessage(
    chatId: number,
    messageId: number,
    data: UpdateMessageSchema
  ) {
    updateMessageStore(chatId, messageId, data.message);

    await patchMessage(messageId, data);
  }

  return { updateMessage };
}

export function useDeleteMessage() {
  const deleteMessageStore = useChatStore((state) => state.deleteMessage);

  async function deleteMessage(chatId: number, messageId: number) {
    deleteMessageStore(chatId, messageId);

    await queryDeleteMessage(messageId);
  }

  return { deleteMessage };
}
