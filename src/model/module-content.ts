import { z } from "zod";

export const ModuleContentSchema = z.object({
  moduleId: z.string(),
  contentId: z.string(),
  position: z.number(),
});

export const ModuleContentWithIdSchema = ModuleContentSchema.extend({
  id: z.string(),
});

export type ModuleContent = z.infer<typeof ModuleContentWithIdSchema>;
export type ModuleContentInput = z.infer<typeof ModuleContentSchema>;
