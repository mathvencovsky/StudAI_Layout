import { useQuery, queryOptions } from "@tanstack/react-query";
import { listAiUsage } from "@/api/ai-usage";

export const listAiUsageQueryOptions = () =>
  queryOptions({
    queryKey: ["ai-usage", "list"],
    queryFn: async () => {
      try {
        return await listAiUsage();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListAiUsage = () => useQuery(listAiUsageQueryOptions());
