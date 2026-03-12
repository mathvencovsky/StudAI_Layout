import {
  type GetModuleContentsParams,
  type ModuleContentWithContentType,
  getModuleContents,
} from "@/api/module-content";
import { getModuleContentsStub } from "@/api/stubs/modules-stub";
import { useQuery, queryOptions } from "@tanstack/react-query";

// Use stub implementation for development
const USE_STUBS = true;

export const getModuleContentsQueryOptions = (
  params: GetModuleContentsParams,
) =>
  queryOptions<ModuleContentWithContentType[]>({
    queryKey: ["moduleContents", params],
    queryFn: async () => {
      try {
        return USE_STUBS ? await getModuleContentsStub(params.moduleId) : await getModuleContents(params);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: !!params.moduleId,
  });

export const useModuleContents = (params: GetModuleContentsParams) =>
  useQuery(getModuleContentsQueryOptions(params));
