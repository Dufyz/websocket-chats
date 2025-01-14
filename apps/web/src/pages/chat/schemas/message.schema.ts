import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  chat_id: z.number(),
  user_id: z.number(),
  message: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const createMessageSchema = messageSchema.pick({
  chat_id: true,
  user_id: true,
  message: true,
});

export const updateMessageSchema = messageSchema.pick({
  message: true,
});

export const deleteMessageSchema = messageSchema.pick({
  id: true,
  chat_id: true,
});

export type MessageSchema = z.infer<typeof messageSchema>;
export type CreateMessageSchema = z.infer<typeof createMessageSchema>;
export type UpdateMessageSchema = z.infer<typeof updateMessageSchema>;
export type DeleteMessageSchema = z.infer<typeof deleteMessageSchema>;
