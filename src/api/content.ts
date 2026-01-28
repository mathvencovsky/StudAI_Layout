import { z } from "zod";

// TODO: migrate to amplify - define proper content types
export const ContentLevelEnum = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);
export const ContentTypeEnum = z.enum(["video", "article", "tutorial"]);

export interface Content {
  id: string;
  type: z.infer<typeof ContentTypeEnum>;
  category: string;
  level: z.infer<typeof ContentLevelEnum>;
  title: string;
  description: string;
  link: string;
  durationInSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export const CreateContentInputSchema = z.object({
  type: ContentTypeEnum,
  category: z.string(),
  level: ContentLevelEnum,
  title: z.string(),
  description: z.string(),
  link: z.string(),
  durationInSeconds: z.number().int().positive(),
});

export type CreateContentInput = z.infer<typeof CreateContentInputSchema>;

export const UpdateContentInputSchema = z.object({
  id: z.string(),
  type: ContentTypeEnum,
  category: z.string(),
  level: ContentLevelEnum,
  title: z.string(),
  description: z.string(),
  link: z.string(),
  durationInSeconds: z.number().int().positive(),
});

export type UpdateContentInput = z.infer<typeof UpdateContentInputSchema>;

/** API: list all content */
export const listContent = async (): Promise<Content[]> => {
  // TODO: migrate to amplify
  return {} as Content[];
};

/** API: get single content */
export const getContent = async (id: string): Promise<Content | null> => {
  // TODO: migrate to amplify
  return {} as Content | null;
};

/** API: create content (stores all strings exactly as provided; no trimming/validation here) */
export const createContent = async (
  input: CreateContentInput,
): Promise<Content> => {
  // TODO: migrate to amplify
  return {} as Content;
};

/** API: update content (preserves createdAt, only updates updatedAt) */
export const updateContent = async (
  input: UpdateContentInput,
): Promise<Content> => {
  // TODO: migrate to amplify
  return {} as Content;
};
