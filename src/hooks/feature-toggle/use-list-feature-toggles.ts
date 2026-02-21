import { useQuery, queryOptions } from "@tanstack/react-query";
import { listFeatureToggles } from "@/api/feature-toggle";

export const listFeatureTogglesQueryOptions = () =>
  queryOptions({
    queryKey: ["feature-toggles", "list"],
    queryFn: async () => {
      try {
        return await listFeatureToggles();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListFeatureToggles = () => useQuery(listFeatureTogglesQueryOptions());
