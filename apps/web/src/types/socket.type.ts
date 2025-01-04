import { Message } from "./message.type";
import { User } from "./user.type";

export type SocketData = SocketJoinData | SocketLeaveData | SocketMessageData;

type SocketJoinData = {
  type: "join";
  room_id: string;
};

type SocketLeaveData = {
  type: "leave";
  room_id: string;
};

type SocketMessageData =
  | SocketMessageDataActionCreate
  | SocketMessageDataActionUpdate
  | SocketMessageDataActionDelete;

type SocketMessageDataActionCreate = {
  type: "message";
  room_id: string;
  payload: {
    action: "create";
    chat_id: number;
    user: User;
    message: Message;
  };
};

type SocketMessageDataActionUpdate = {
  type: "message";
  room_id: string;
  payload: {
    action: "update";
    chat_id: number;
    message: Message;
  };
};

type SocketMessageDataActionDelete = {
  type: "message";
  room_id: string;
  payload: {
    action: "delete";
    chat_id: number;
    message_id: number;
  };
};
