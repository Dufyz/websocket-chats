import { Chat } from "@/types/chat.type";
import { Message } from "@/types/message.type";
import { User } from "@/types/user.type";
import { v4 } from "uuid";
import { create } from "zustand";

const dummyUsers: User[] = [
  {
    id: v4(),
    name: "Alice",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: v4(),
    name: "Bob",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: v4(),
    name: "Charlie",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const dummyMessages: Message[] = [
  {
    id: v4(),
    chat_id: v4(),
    user_id: dummyUsers[0].id,
    message: "Hey everyone!",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: v4(),
    chat_id: v4(),
    user_id: dummyUsers[1].id,
    message: "Hi Alice, how are you?",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: v4(),
    chat_id: v4(),
    user_id: dummyUsers[2].id,
    message: "Hello folks!",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const dummyChats: Chat[] = [
  {
    id: v4(),
    name: "Tech Talks",
    description: "Discuss the latest in technology",
    category: "Technology",
    users: dummyUsers,
    messages: dummyMessages,
    admin_user_id: dummyUsers[0].id,
  },
  {
    id: v4(),
    name: "Gaming Lounge",
    description: "Find gaming partners and discuss strategies",
    category: "Gaming",
    users: dummyUsers,
    messages: dummyMessages,
    admin_user_id: dummyUsers[0].id,
  },
  {
    id: v4(),
    name: "Music Production",
    description: "Share and discuss music production techniques",
    category: "Music",
    users: dummyUsers,
    messages: dummyMessages,
    admin_user_id: dummyUsers[0].id,
  },
];

type ChatStore = {
  chats: Chat[];

  create: (chat: Chat) => void;
  update: (chat: Partial<Chat>) => void;
  delete: (id: string) => void;
  joinChat: (chatId: string, user: User) => void;
  leaveChat: (chatId: string, userId: string) => void;

  createMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, message: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  chats: dummyChats,

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

  joinChat: (chatId, user) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              users: [...(c.users || []), user],
            }
          : c
      ),
    })),

  leaveChat: (chatId, userId) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              users: (c.users || []).filter((u) => u.id !== userId),
            }
          : c
      ),
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
