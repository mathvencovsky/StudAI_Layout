import { useQuery, queryOptions } from "@tanstack/react-query";
import { getUserStats } from "@/api/user-stats";
import { type UserStats } from "@/model/user-stats";

export const getUserStatsQueryOptions = () =>
  queryOptions<UserStats>({
    queryKey: ["userStats"],
    queryFn: getUserStats,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  });

/**
 * Query hook for fetching user statistics
 */
export const useUserStats = () => useQuery(getUserStatsQueryOptions());
