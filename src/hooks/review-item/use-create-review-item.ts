import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReviewItem, type CreateReviewItemInput } from "@/api/review-item";

export const useCreateReviewItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewItemInput) => {
      return await createReviewItem(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-items"] });
    },
  });
};
