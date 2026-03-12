import { getUserContentProgress } from "@/api/user-content-progress";
import { getUserContentProgressStub } from "@/api/stubs/modules-stub";
import { type UserContentProgress } from "@/model/user-content-progress";
import { useQuery, queryOptions } from "@tanstack/react-query";

// Use stub implementation for development
const USE_STUBS = true;

export const getUserContentProgressQueryOptions = (moduleId: string) =>
  queryOptions<UserContentProgress[]>({
    queryKey: ["userContentProgress", moduleId],
    queryFn: async () => {
      try {
        return USE_STUBS ? await getUserContentProgressStub(moduleId) : await getUserContentProgress(moduleId);
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
 * Query hook for fetching all content completion status for a module
 * Returns array of UserContentProgress records
 */
export const useGetUserContentProgress = (moduleId: string) =>
  useQuery(getUserContentProgressQueryOptions(moduleId));
