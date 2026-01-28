import { useQuery, queryOptions } from "@tanstack/react-query";
import { getUserVote } from "@/api/votes";

/**
 * Query options for getting user vote
 */
export function getUserVoteQueryOptions(moduleId: string, uid: string) {
  return queryOptions({
    queryKey: ["userVote", moduleId, uid],
    queryFn: () => getUserVote(moduleId, uid),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch the current user's vote state for a module
 */
export function useGetUserVote(moduleId: string, uid: string) {
  return useQuery(getUserVoteQueryOptions(moduleId, uid));
}
