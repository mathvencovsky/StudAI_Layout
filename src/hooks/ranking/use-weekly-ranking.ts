import { useQuery, queryOptions } from "@tanstack/react-query";
import { getWeeklyRanking } from "@/api/ranking";

export const weeklyRankingQueryOptions = () =>
  queryOptions({
    queryKey: ["ranking", "weekly"],
    queryFn: async () => {
      try {
        return await getWeeklyRanking();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useWeeklyRanking = () => useQuery(weeklyRankingQueryOptions());
