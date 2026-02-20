import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGoal, type CreateGoalInput } from "@/api/goal";

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGoalInput) => {
      return await createGoal(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
};
