import { useQuery, queryOptions } from "@tanstack/react-query";
import { getModule } from "@/api/modules";
import { type Module } from "@/model/module";

export const getModuleQueryOptions = (moduleId?: string) =>
  queryOptions<Module | null>({
    queryKey: ["module", moduleId],
    queryFn: async () => {
      if (!moduleId) return null;
      try {
        return await getModule({ id: moduleId });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: !!moduleId,
  });

export const useModule = (moduleId?: string) =>
  useQuery(getModuleQueryOptions(moduleId));
