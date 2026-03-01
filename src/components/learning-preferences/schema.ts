import { z } from "zod";
import { type TrackCategory } from "@/model/track";

const trackCategoryValues = [
  "web_development",
  "mobile_development",
  "data_science",
  "machine_learning",
  "cloud_computing",
  "devops",
  "cybersecurity",
  "databases",
  "ui_ux_design",
  "game_development",
  "blockchain",
  "embedded_systems",
] as const satisfies TrackCategory[];

export const learningPreferencesSchema = z.object({
  interests: z.array(z.enum(trackCategoryValues)).min(1),
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
