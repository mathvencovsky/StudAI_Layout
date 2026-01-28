import {
  type GetModuleContentsParams,
  type GetModuleContentsResponse,
  getModuleContents,
} from "@/api/module-content";
import { useQuery, queryOptions } from "@tanstack/react-query";

export const getModuleContentsQueryOptions = (
  params: GetModuleContentsParams
) =>
  queryOptions<GetModuleContentsResponse>({
    queryKey: ["moduleContents", params],
    queryFn: async () => {
      try {
        return await getModuleContents(params);
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
