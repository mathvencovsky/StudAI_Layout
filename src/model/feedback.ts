import { z } from "zod";

export const FeedbackInputSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional().nullable(),
});

export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

export const FeedbackStorageSchema = FeedbackInputSchema.extend({
  url: z.string(),
  uid: z.string(),
  timestamp: z.any().optional(),
});

export type FeedbackStorage = z.infer<typeof FeedbackStorageSchema>;

export type Feedback = FeedbackInput &
  FeedbackStorage & {
    id: string;
  };
