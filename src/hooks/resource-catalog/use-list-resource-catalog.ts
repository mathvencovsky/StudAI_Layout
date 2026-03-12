import { useQuery, queryOptions } from "@tanstack/react-query";
import { listResourceCatalog } from "@/api/resource-catalog";

export const listResourceCatalogQueryOptions = () =>
  queryOptions({
    queryKey: ["resource-catalog", "list"],
    queryFn: async () => {
      try {
        return await listResourceCatalog();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListResourceCatalog = () =>
  useQuery(listResourceCatalogQueryOptions());
