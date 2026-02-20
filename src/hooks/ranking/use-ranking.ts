import { useQuery } from "@tanstack/react-query";
import { getRankingStub } from "@/api/stubs/ranking-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useRanking(period: "week" | "month" | "all" = "week") {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN, "ranking", period],
    queryFn: () => getRankingStub(period),
    staleTime: 1000 * 60 * 5,
  });
}
