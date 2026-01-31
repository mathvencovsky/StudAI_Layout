import { useMutation } from "@tanstack/react-query";
import { createFeedback, type CreateFeedbackInput } from "@/api/feedback";

/**
 * Hook for creating feedback submissions
 */
export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: (feedback: CreateFeedbackInput) => createFeedback(feedback),
  });
};
