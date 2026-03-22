import { useQuery, queryOptions } from "@tanstack/react-query";
import { listSubscriptions } from "@/api/subscription";

export const listSubscriptionsQueryOptions = () =>
  queryOptions({
    queryKey: ["subscriptions", "list"],
    queryFn: async () => {
      try {
        return await listSubscriptions();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListSubscriptions = () =>
  useQuery(listSubscriptionsQueryOptions());
