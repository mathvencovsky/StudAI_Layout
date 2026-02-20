import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import {
  getActiveGoalStub,
  getGoalHistoryStub,
  createGoalStub,
  type Goal,
} from "@/api/stubs/goals-stub";

export function useActiveGoal() {
  return useQuery({
    queryKey: queryKeys.goals.active,
    queryFn: getActiveGoalStub,
    staleTime: 60000,
  });
}

export function useGoalHistory() {
  return useQuery({
    queryKey: queryKeys.goals.history,
    queryFn: getGoalHistoryStub,
    staleTime: 300000,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goal: Omit<Goal, "id" | "status" | "progress">) =>
      createGoalStub(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}
