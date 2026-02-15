import { useQuery, queryOptions } from "@tanstack/react-query";
import { getContent } from "@/api/content";

export const getContentQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["content", "detail", id],
    queryFn: async () => {
      try {
        return await getContent({ id });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!id,
  });

export const useGetContent = (id: string) =>
  useQuery(getContentQueryOptions(id));
