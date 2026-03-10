import { useQuery, queryOptions } from "@tanstack/react-query";
import { getUserStats } from "@/api/user-stats";
import { getUserStatsStub } from "@/api/stubs/user-stats-stub";
import { type UserStats } from "@/model/user-stats";

// Use stub implementation for development
const USE_STUBS = true;

export const getUserStatsQueryOptions = () =>
  queryOptions<UserStats>({
    queryKey: ["userStats"],
    queryFn: USE_STUBS ? getUserStatsStub : getUserStats,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  });

/**
 * Query hook for fetching user statistics
 */
export const useUserStats = () => useQuery(getUserStatsQueryOptions());
