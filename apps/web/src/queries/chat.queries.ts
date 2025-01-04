import api from "@/config/api.config";
import {
  CreateChatSchema,
  UpdateChatSchema,
} from "@/pages/chat/schemas/chat.schema";
import { Chat } from "@/types/chat.type";
import { User } from "@/types/user.type";

export async function getChats(
  search: string = "",
  cursor: number | null = null,
  limit: number = 30
): Promise<{
  data: {
    chats: {
      chat: Chat;
      users: User[];
      total_users: number;
      total_messages: number;
    }[];
    pagination: {
      total: number;
      cursor: number | null;
      next_cursor: number | null;
    };
  };
}> {
  const response = await api.get(
    `/chats?search=${search}&cursor=${cursor}&limit=${limit}`
  );

  return response.data;
}

export async function getChatById(id: number): Promise<{
  chat: Chat;
  users: User[];
  total_users: number;
  total_messages: number;
}> {
  const response = await api.get(`/chats/${id}`);

  return response.data;
}

export async function getChatByUserId(userId: number): Promise<{
  chats: Chat[];
}> {
  const response = await api.get(`/chats/user/${userId}`);

  return response.data;
}

export async function postChat(data: CreateChatSchema): Promise<{
  chat: Chat;
}> {
  const response = await api.post("/chats", data);

  return response.data;
}

export async function patchChat(
  id: number,
  data: UpdateChatSchema
): Promise<{
  chat: Chat;
}> {
  const response = await api.patch(`/chats/${id}`, data);

  return response.data;
}

export async function deleteChat(id: number): Promise<void> {
  await api.delete(`/chats/${id}`);
}
