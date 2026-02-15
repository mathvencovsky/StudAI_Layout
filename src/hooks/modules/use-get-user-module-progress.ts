import { useQuery, queryOptions } from "@tanstack/react-query";
import { getUserModuleProgress } from "@/api/module-progress";
import type { UserModuleProgress } from "@/model/user-module-progress";

export const getUserModuleProgressQueryOptions = (moduleId: string) =>
  queryOptions<UserModuleProgress | null>({
    queryKey: ["userModuleProgress", moduleId],
    queryFn: () => {
      try {
        return getUserModuleProgress(moduleId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: !!moduleId,
  });

/**
 * Query hook for fetching user's progress for a specific module
 * Returns null if user hasn't started the module
 */
export const useGetUserModuleProgress = (moduleId: string) =>
  useQuery(getUserModuleProgressQueryOptions(moduleId));
