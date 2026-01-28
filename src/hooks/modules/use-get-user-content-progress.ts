import {
  getUserContentProgress,
  type GetUserContentProgressResponse,
} from "@/api/user-content-progress";
import { useQuery, queryOptions } from "@tanstack/react-query";

export const getUserContentProgressQueryOptions = (moduleId: string) =>
  queryOptions<GetUserContentProgressResponse>({
    queryKey: ["userContentProgress", moduleId],
    queryFn: async () => {
      try {
        return await getUserContentProgress(moduleId);
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
