import { useQuery, queryOptions } from "@tanstack/react-query";
import {
  getModules,
  type GetModulesParams,
  type GetModulesResponse,
} from "@/api/modules";

export const getModulesQueryOptions = (params: GetModulesParams) =>
  queryOptions<GetModulesResponse>({
    queryKey: ["modules", params],
    queryFn: () => getModules(params),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

export const useModules = (params: GetModulesParams) =>
  useQuery(getModulesQueryOptions(params));
