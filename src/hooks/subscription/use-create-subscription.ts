import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubscription } from "@/api/subscription";
import type { CreateSubscriptionInput } from "@/api/subscription";

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSubscriptionInput) => createSubscription(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
};
