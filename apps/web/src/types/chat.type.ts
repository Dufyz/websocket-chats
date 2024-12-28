import { Message } from "./message.type";
import { User } from "./user.type";

export type Chat = {
  id: string;
  admin_user_id: string;
  name: string;
  category: string;
  description: string | null;

  users?: User[];
  messages?: Message[];
};
