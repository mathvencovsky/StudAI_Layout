import { useQuery, queryOptions } from "@tanstack/react-query";
import { listSavedItems } from "@/api/saved-item";

export const listSavedItemsQueryOptions = () =>
  queryOptions({
    queryKey: ["saved-items", "list"],
    queryFn: async () => {
      try {
        return await listSavedItems();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListSavedItems = () => useQuery(listSavedItemsQueryOptions());
