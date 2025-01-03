import { User } from "./user.type";

export type SocketData =
  | {
      type: "join";
      room_id: string;
    }
  | {
      type: "leave";
      room_id: string;
    }
  | {
      type: "message";
      room_id: string;
      payload: {
        chat_id: number;
        user: User;
        message: string;
      };
    };
