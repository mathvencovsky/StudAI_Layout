import { useQuery, queryOptions } from "@tanstack/react-query";
import { getMyAiWaitlist } from "@/api/ai-waitlist/get-my-ai-waitlist";

/**
 * Query options for getting the current user's AI waitlist entry
 */
export const getMyAiWaitlistQueryOptions = () =>
  queryOptions({
    queryKey: ["ai-waitlist", "me"],
    queryFn: getMyAiWaitlist,
  });

/**
 * Hook to get the current user's AI waitlist entry
 */
export const useMyAiWaitlist = () => useQuery(getMyAiWaitlistQueryOptions());
