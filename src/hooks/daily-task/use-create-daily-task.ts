import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDailyTask, type CreateDailyTaskInput } from "@/api/daily-task";

export const useCreateDailyTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateDailyTaskInput) => {
      return await createDailyTask(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
    },
  });
};
