import { useQuery, queryOptions } from "@tanstack/react-query";
import { listFavouriteContents } from "@/api/favourite-content";

export const listFavouriteContentsQueryOptions = () =>
  queryOptions({
    queryKey: ["favourite-contents"],
    queryFn: listFavouriteContents,
  });

export const useListFavouriteContents = () =>
  useQuery(listFavouriteContentsQueryOptions());
