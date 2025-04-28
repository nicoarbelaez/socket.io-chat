import { z } from 'zod';

const positionBaseSchema = z.object({
  top: z.number(),
  left: z.number(),
});

const userInfoSchema = z.object({
  username: z.string(),
  socketId: z.string(),
});

export const circlePositionSchema = positionBaseSchema.extend({
  username: z.string().nullable(),
  socketId: z.string().nullable(),
  color: z.string().optional(),
});

export const circlePositionUpdateSchema = positionBaseSchema
  .merge(userInfoSchema)
  .extend({
    color: z.string().optional(),
});

export const circlePositionDtoSchema = positionBaseSchema.extend({
  username: z.string(),
  color: z.string().optional(),
});

// Types exportados
export type CirclePosition = z.infer<typeof circlePositionSchema>;
export type CirclePositionUpdate = z.infer<typeof circlePositionUpdateSchema>;
export type CirclePositionDto = z.infer<typeof circlePositionDtoSchema>;
export type CircleCoordinates = z.infer<typeof positionBaseSchema>;