import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDailyTask, type UpdateDailyTaskInput } from "@/api/daily-task";

export const useUpdateDailyTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateDailyTaskInput) => {
      return await updateDailyTask(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
    },
  });
};
