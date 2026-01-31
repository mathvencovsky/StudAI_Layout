import { useQuery, queryOptions } from "@tanstack/react-query";
import { getModule } from "@/api/modules";
import { type Schema } from "../../../amplify/data/resource";

export const getModuleQueryOptions = (moduleId?: string) =>
  queryOptions<Schema["Module"]["type"] | null>({
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
