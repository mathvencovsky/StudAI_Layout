import { z } from "zod";

export const learningPreferencesSchema = z.object({
  interests: z.array(z.string()).min(1),
  minutesPerDay: z.number().min(5).max(120).optional(),
  days: z.array(z.string()).optional(),
  formats: z.array(z.string()).optional(),
  contentLength: z
    .enum(["bite_sized", "short", "medium", "deep_dive"])
    .optional(),
});

export type LearningPreferencesFormValues = z.infer<
  typeof learningPreferencesSchema
>;
