import {
  CreateMessageSchema,
  UpdateMessageSchema,
} from "@/pages/chat/schemas/message.schema";
import { useChatStore } from "@/pages/chat/stores/chat.store";

export function useCreateMessage() {
  const createMessageStore = useChatStore((state) => state.createMessage);

  function createMessage(data: CreateMessageSchema) {
    createMessageStore(data.chat_id, data);
  }

  return { createMessage };
}

export function useUpdateMessage() {
  const updateMessageStore = useChatStore((state) => state.updateMessage);

  function updateMessage(
    chatId: string,
    messageId: string,
    data: UpdateMessageSchema
  ) {
    updateMessageStore(chatId, messageId, data.message);
  }

  return { updateMessage };
}

export function useDeleteMessage() {
  const deleteMessageStore = useChatStore((state) => state.deleteMessage);

  function deleteMessage(chatId: string, messageId: string) {
    deleteMessageStore(chatId, messageId);
  }

  return { deleteMessage };
}
