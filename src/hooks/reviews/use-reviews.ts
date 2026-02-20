import { useQuery } from "@tanstack/react-query";
import { getReviewsStub } from "@/api/stubs/reviews-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useReviews(category?: "today" | "this-week" | "completed") {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, category],
    queryFn: () => getReviewsStub(category),
    staleTime: 1000 * 60 * 5,
  });
}
