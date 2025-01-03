import api from "@/config/api.config";
import {
  CreateMessageSchema,
  UpdateMessageSchema,
} from "@/pages/chat/schemas/message.schema";
import { Message } from "@/types/message.type";

export async function getMessages(
  chatId: number,
  cursor: number | null = null,
  limit: number = 30
): Promise<{
  data: {
    messages: Message[];
    pagination: {
      total: number;
      cursor: number | null;
      next_cursor: number | null;
    };
  };
}> {
  const response = await api.get(
    `/messages/chat/${chatId}?cursor=${cursor}&limit=${limit}`
  );

  const data = {
    ...response.data,
    messages: (response.data.messages || []).sort(
      (a: Message, b: Message) => a.id - b.id
    ),
  };

  return data;
}

export async function postMessage(data: CreateMessageSchema): Promise<{
  message: Message;
}> {
  const response = await api.post("/messages", data);

  return response.data;
}

export async function patchMessage(
  id: number,
  data: UpdateMessageSchema
): Promise<{
  message: Message;
}> {
  const response = await api.patch(`/messages/${id}`, data);

  return response.data;
}

export async function deleteMessage(id: number): Promise<void> {
  await api.delete(`/messages/${id}`);
}
