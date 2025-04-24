import { z } from 'zod';

export const messageSchema = z.object({
  id: z.string().min(3),
  content: z.string().min(1),
  timestamp: z.number(),
  roomId: z.string(),
  userId: z.string(),
  groupId: z.string(),
  seenBy: z.array(z.string()),
});

export const messageDtoSchema = messageSchema;

export type Message = z.infer<typeof messageSchema>;
export type MessageDto = z.infer<typeof messageDtoSchema>;
