import { z } from "zod";

export const ModuleSchema = z.object({
  title: z.string(),
  description: z.string(),
  upvoteCount: z.number().int().nonnegative().optional(),
  downvoteCount: z.number().int().nonnegative().optional(),
});

export const ModuleWithIdSchema = ModuleSchema.extend({
  id: z.string(),
});

export type Module = z.infer<typeof ModuleWithIdSchema>;
export type ModuleInput = z.infer<typeof ModuleSchema>;
