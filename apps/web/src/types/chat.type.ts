import { Message } from "./message.type";
import { User } from "./user.type";

export type Chat = {
  id: number;
  admin_user_id: number;
  name: string;
  category: string;
  description: string | null;

  messages?: Message[];
  users?: User[];

  total_users?: number;
  total_messages?: number;
};
