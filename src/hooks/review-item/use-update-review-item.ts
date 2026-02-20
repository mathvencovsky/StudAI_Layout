import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReviewItem, type UpdateReviewItemInput } from "@/api/review-item";

export const useUpdateReviewItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateReviewItemInput) => {
      return await updateReviewItem(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-items"] });
    },
  });
};
