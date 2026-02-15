import { useQuery, queryOptions } from "@tanstack/react-query";
import { listFavouriteModules } from "@/api/favourite-module";

export const listFavouriteModulesQueryOptions = () =>
  queryOptions({
    queryKey: ["favourite-modules"],
    queryFn: listFavouriteModules,
  });

export const useListFavouriteModules = () =>
  useQuery(listFavouriteModulesQueryOptions());
