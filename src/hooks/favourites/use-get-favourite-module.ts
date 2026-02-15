import { useQuery, queryOptions } from "@tanstack/react-query";
import { getFavouriteModule } from "@/api/favourite-module";

export const getFavouriteModuleQueryOptions = (moduleId: string) =>
  queryOptions({
    queryKey: ["favourite-module", moduleId],
    queryFn: () => getFavouriteModule(moduleId),
    enabled: !!moduleId,
  });

export const useGetFavouriteModule = (moduleId: string) =>
  useQuery(getFavouriteModuleQueryOptions(moduleId));
