import { useQuery, queryOptions } from "@tanstack/react-query";
import { getModule } from "@/api/modules";
import { getModuleStub } from "@/api/stubs/modules-stub";
import { type Module } from "@/model/module";

// Use stub implementation for development
const USE_STUBS = true;

export const getModuleQueryOptions = (moduleId?: string) =>
  queryOptions<Module | null>({
    queryKey: ["module", moduleId],
    queryFn: async () => {
      if (!moduleId) return null;
      try {
        return USE_STUBS ? await getModuleStub(moduleId) : await getModule({ id: moduleId });
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
