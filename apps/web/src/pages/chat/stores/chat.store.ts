import { Chat } from "@/types/chat.type";
import { Message } from "@/types/message.type";
import { create } from "zustand";

type ChatStore = {
  chats: Chat[];

  setChats: (chats: Chat[]) => void;

  create: (chat: Chat) => void;
  update: (chat: Partial<Chat>) => void;
  delete: (id: number) => void;

  createMessage: (chatId: number, message: Message) => void;
  updateMessage: (chatId: number, messageId: number, message: string) => void;
  deleteMessage: (chatId: number, messageId: number) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],

  setChats: (chats) =>
    set((state) => ({
      chats: chats.reduce((acc, chat) => {
        const index = acc.findIndex((c) => c.id === chat.id);
        if (index !== -1) {
          acc[index] = { ...acc[index], ...chat };
        } else {
          acc = [...acc, chat];
        }
        return acc;
      }, state.chats),
    })),

  create: (chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),

  update: (chat) =>
    set((state) => ({
      chats: state.chats.map((c) => (c.id === chat.id ? { ...c, ...chat } : c)),
    })),

  delete: (id) =>
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== id),
    })),

  createMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId
          ? { ...c, messages: [...(c.messages || []), message] }
          : c
      ),
    })),

  updateMessage: (chatId, messageId, message) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: (c.messages || []).map((m) =>
                m.id === messageId ? { ...m, message } : m
              ),
            }
          : c
      ),
    })),

  deleteMessage: (chatId, messageId) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: (c.messages || []).filter((m) => m.id !== messageId),
            }
          : c
      ),
    })),
}));