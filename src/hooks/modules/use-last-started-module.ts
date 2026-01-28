import { useQuery, queryOptions } from "@tanstack/react-query";
import { getLastStartedModule } from "@/api/module-progress";
import type { UserModuleProgress } from "@/model/user-module-progress";

export const getLastStartedModuleQueryOptions = () =>
  queryOptions<UserModuleProgress | null>({
    queryKey: ["lastStartedModule"],
    queryFn: () => {
      try {
        return getLastStartedModule();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

/**
 * Query hook for fetching the user's most recently started module
 * Returns null if user hasn't started any modules
 */
export const useLastStartedModule = () =>
  useQuery(getLastStartedModuleQueryOptions());
