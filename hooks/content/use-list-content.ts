import { useQuery, queryOptions } from "@tanstack/react-query";
import { listContent } from "@/api/content";

export const listContentQueryOptions = () =>
  queryOptions({
    queryKey: ["content", "list"],
    queryFn: async () => {
      try {
        return await listContent();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListContent = () => useQuery(listContentQueryOptions());
