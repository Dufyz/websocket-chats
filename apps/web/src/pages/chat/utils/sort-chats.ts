import { Chat } from "@/types/chat.type";

export default function sortChats(chats: Chat[], userId: string): Chat[] {
  return chats.sort((a, b) => {
    const iAmChatAMember = a.users?.some((user) => user.id === userId);
    const iAmChatBMember = b.users?.some((user) => user.id === userId);

    const iAmChatAAdmin = a.admin_user_id === userId;
    const iAmChatBAdmin = b.admin_user_id === userId;

    if (iAmChatAAdmin && !iAmChatBAdmin) return -1;
    if (iAmChatBAdmin && !iAmChatAAdmin) return 1;

    if (iAmChatAMember && !iAmChatBMember) return -1;
    if (iAmChatBMember && !iAmChatAMember) return 1;

    return 0;
  });
}
