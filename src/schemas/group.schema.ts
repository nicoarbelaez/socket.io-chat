import { z } from 'zod';

export const groupSchema = z.object({
  id: z.string().min(3),
  name: z.string().min(3),
  icon: z.string().emoji(),
  namespace: z.enum(['default', 'admin']),
});

export const groupDtoSchema = groupSchema;

export type Group = z.infer<typeof groupSchema>;
export type GroupDto = z.infer<typeof groupDtoSchema>;
export type NamespaceGroup = 'default' | 'admin';
