import { useQuery, queryOptions } from "@tanstack/react-query";
import { getModules, type GetModulesParams } from "@/api/modules";
import { type Module } from "@/model/module";

/**
 * Query options for fetching modules
 */
export const getModulesQueryOptions = (params: GetModulesParams = {}) =>
  queryOptions<Module[]>({
    queryKey: ["modules", params],
    queryFn: () => getModules(params),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

/**
 * Hook to fetch modules with optional filtering
 */
export const useModules = (params: GetModulesParams = {}) =>
  useQuery(getModulesQueryOptions(params));
