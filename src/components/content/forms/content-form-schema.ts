import { z } from "zod";

export const contentFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["youtube_video", "article", "quiz", "assignment", "lab"]).nullable().optional(),
  durationInSeconds: z.number().int().min(0),
  link: z.string().url(),
  category: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]).nullable().optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
  author: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  aiTranscript: z.string().nullable().optional(),
  aiSummary: z.string().nullable().optional(),
});

export type ContentFormInput = z.infer<typeof contentFormSchema>;
