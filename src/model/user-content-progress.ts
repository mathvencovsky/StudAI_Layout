import { z } from "zod";

export const UserContentProgressSchema = z.object({
  uid: z.string(),
  moduleId: z.string(),
  contentId: z.string(),
  isCompleted: z.boolean(),
  completionDate: z.string().optional(),
});

export const UserContentProgressWithIdSchema = UserContentProgressSchema.extend(
  {
    id: z.string(),
  },
);

export type UserContentProgress = z.infer<
  typeof UserContentProgressWithIdSchema
>;
export type UserContentProgressInput = z.infer<
  typeof UserContentProgressSchema
>;
