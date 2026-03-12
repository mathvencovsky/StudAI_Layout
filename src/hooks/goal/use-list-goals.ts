import { useQuery, queryOptions } from "@tanstack/react-query";
import { listGoals } from "@/api/goal";

export const listGoalsQueryOptions = () =>
  queryOptions({
    queryKey: ["goals", "list"],
    queryFn: async () => {
      try {
        return await listGoals();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListGoals = () => useQuery(listGoalsQueryOptions());
