import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().min(3),
  username: z.string().min(3),
  socketId: z.string(),
  online: z.boolean(),
  lastConnection: z.number(),
});

export const userDtoSchema = userSchema.omit({ online: true });

export type User = z.infer<typeof userSchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
