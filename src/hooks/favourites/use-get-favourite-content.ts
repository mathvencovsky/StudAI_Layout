import { useQuery, queryOptions } from "@tanstack/react-query";
import { getFavouriteContent } from "@/api/favourite-content";

export const getFavouriteContentQueryOptions = (contentId: string) =>
  queryOptions({
    queryKey: ["favourite-content", contentId],
    queryFn: () => getFavouriteContent(contentId),
    enabled: !!contentId,
  });

export const useGetFavouriteContent = (contentId: string) =>
  useQuery(getFavouriteContentQueryOptions(contentId));
