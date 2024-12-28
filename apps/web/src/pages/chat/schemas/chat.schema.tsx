import { categories } from "@/data/categories.data";
import { z } from "zod";

export const chatSchema = z.object({
  id: z.string(),
  admin_user_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.enum(categories as [string, ...string[]]),
  created_at: z.date(),
  updated_at: z.date(),
});

export const createChatSchema = chatSchema;

export const updateChatSchema = chatSchema
  .pick({
    name: true,
    description: true,
    category: true,
  })
  .partial();

export const deleteChatSchema = chatSchema.pick({ id: true });

export type ChatSchema = z.infer<typeof chatSchema>;
export type CreateChatSchema = z.infer<typeof createChatSchema>;
export type UpdateChatSchema = z.infer<typeof updateChatSchema>;
export type DeleteChatSchema = z.infer<typeof deleteChatSchema>;
