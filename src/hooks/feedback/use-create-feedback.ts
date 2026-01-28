import { useMutation } from "@tanstack/react-query";
import { createFeedback } from "@/api/feedback";
import { type FeedbackStorage } from "@/model/feedback";

/**
 * Hook for creating feedback submissions
 */
export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: (feedback: FeedbackStorage) => createFeedback(feedback),
  });
};
