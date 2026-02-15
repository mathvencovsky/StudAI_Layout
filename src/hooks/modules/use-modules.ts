import { useQuery, queryOptions } from "@tanstack/react-query";
import { getModules, type GetModulesParams } from "@/api/modules";
import { type Module } from "@/model/module";

/**
 * Query options for fetching modules with optional filtering
 */
export const getModulesQueryOptions = (params: GetModulesParams = {}) =>
  queryOptions<Module[]>({
    queryKey: ["modules", params],
    queryFn: async () => {
      const modules = await getModules();

      if (!params.q) {
        return modules;
      }

      const searchTerm = params.q.toLowerCase();
      return modules.filter(
        (module) =>
          module.title.toLowerCase().includes(searchTerm) ||
          module.description.toLowerCase().includes(searchTerm),
      );
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

/**
 * Hook to fetch modules with optional filtering
 */
export const useModules = (params: GetModulesParams = {}) =>
  useQuery(getModulesQueryOptions(params));
