import { z } from "zod";

export const UserModuleProgressSchema = z.object({
  uid: z.string(),
  moduleId: z.string(),
  startDate: z.string(),
  completionDate: z.string().optional(),
});

export const UserModuleProgressWithIdSchema = UserModuleProgressSchema.extend({
  id: z.string(),
});

export type UserModuleProgress = z.infer<typeof UserModuleProgressWithIdSchema>;
export type UserModuleProgressInput = z.infer<typeof UserModuleProgressSchema>;
