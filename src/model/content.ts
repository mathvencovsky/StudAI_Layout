import { z } from "zod";

export const ContentTypeEnum = z.enum([
  "youtube-video",
  "article",
  "quiz",
  "assignment",
  "lab",
]);

export const ContentLevelEnum = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export const ContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: ContentTypeEnum,
  durationInSeconds: z.number().int().positive(),
  link: z.string(),
  category: z.string(),
  level: ContentLevelEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ContentWithIdSchema = ContentSchema.extend({
  id: z.string(),
});

export type Content = z.infer<typeof ContentWithIdSchema>;
export type ContentInput = z.infer<typeof ContentSchema>;
export type ContentType = z.infer<typeof ContentTypeEnum>;
export type ContentLevel = z.infer<typeof ContentLevelEnum>;
