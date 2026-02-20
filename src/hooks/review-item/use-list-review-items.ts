import { useQuery, queryOptions } from "@tanstack/react-query";
import { listReviewItems } from "@/api/review-item";

export const listReviewItemsQueryOptions = () =>
  queryOptions({
    queryKey: ["review-items", "list"],
    queryFn: async () => {
      try {
        return await listReviewItems();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListReviewItems = () => useQuery(listReviewItemsQueryOptions());
