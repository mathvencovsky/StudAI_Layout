import { useQuery, queryOptions } from "@tanstack/react-query";
import { getAvailableContent } from "@/api/module-content";
import type { Content } from "@/model/content";

export const getAvailableContentQueryOptions = () =>
  queryOptions<Content[]>({
    queryKey: ["availableContent"],
    queryFn: () => getAvailableContent(),
    staleTime: 5 * 60_000, // 5 minutes - content doesn't change frequently
    gcTime: 10 * 60_000, // 10 minutes
  });

export const useAvailableContent = () =>
  useQuery(getAvailableContentQueryOptions());
