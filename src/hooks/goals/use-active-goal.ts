import { useQuery } from "@tanstack/react-query";
import { getActiveGoalStub } from "@/api/stubs/goals-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useActiveGoal() {
  return useQuery({
    queryKey: [QUERY_KEYS.GOALS, "active"],
    queryFn: getActiveGoalStub,
    staleTime: 1000 * 60 * 5,
  });
}
