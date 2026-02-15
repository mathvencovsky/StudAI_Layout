import { useQuery, queryOptions } from "@tanstack/react-query";
import {
  getBatchModuleProgress,
  type ModuleProgressMap,
} from "@/api/batch-module-progress";

/**
 * Query options for fetching progress of multiple modules
 */
export const getBatchModuleProgressQueryOptions = (moduleIds: string[]) =>
  queryOptions<ModuleProgressMap>({
    queryKey: ["batchModuleProgress", [...moduleIds].sort()],
    queryFn: () => getBatchModuleProgress(moduleIds),
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    enabled: moduleIds.length > 0,
  });

/**
 * Hook to fetch progress for multiple modules in a single batch call
 */
export const useBatchModuleProgress = (moduleIds: string[]) =>
  useQuery(getBatchModuleProgressQueryOptions(moduleIds));
