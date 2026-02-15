import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAiWaitlist } from "@/api/ai-waitlist/create-ai-waitlist";

/**
 * Hook to create an AI waitlist entry for the current user
 */
export const useCreateAiWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAiWaitlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-waitlist", "me"] });
    },
  });
};
