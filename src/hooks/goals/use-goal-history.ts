import { useQuery } from "@tanstack/react-query";
import { getGoalHistoryStub } from "@/api/stubs/goals-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useGoalHistory() {
  return useQuery({
    queryKey: [QUERY_KEYS.GOALS, "history"],
    queryFn: getGoalHistoryStub,
    staleTime: 1000 * 60 * 5,
  });
}
