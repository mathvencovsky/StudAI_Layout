import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserPlan, type CreateUserPlanInput } from "@/api/user-plan";

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserPlanInput) => {
      return await createUserPlan(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-plan"] });
    },
  });
};
