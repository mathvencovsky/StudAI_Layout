import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAiUsage } from "@/api/ai-usage";
import type { CreateAiUsageInput } from "@/api/ai-usage";

export const useCreateAiUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAiUsageInput) => createAiUsage(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-usage"] });
    },
  });
};
