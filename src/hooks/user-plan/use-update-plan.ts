import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserPlan, type UpdateUserPlanInput } from "@/api/user-plan";

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateUserPlanInput) => {
      return await updateUserPlan(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-plan"] });
    },
  });
};
