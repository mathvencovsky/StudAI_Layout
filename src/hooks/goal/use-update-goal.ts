import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGoal, type UpdateGoalInput } from "@/api/goal";

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateGoalInput) => {
      return await updateGoal(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
};
