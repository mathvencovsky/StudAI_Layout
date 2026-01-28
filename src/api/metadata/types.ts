import { z } from "zod";

export const ExtractedMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  favicon: z.string().optional(),
  url: z.string(),
  durationInSeconds: z.number(),
});

export type ExtractedMetadata = z.infer<typeof ExtractedMetadataSchema>;
