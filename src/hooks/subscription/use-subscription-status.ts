import { useQuery, queryOptions } from "@tanstack/react-query";
import { getSubscriptionStatus } from "@/api/billing";
import type { SubscriptionStatus } from "@/api/billing";
import { useAuth } from "@/hooks/use-auth";

export const subscriptionStatusQueryOptions = () =>
  queryOptions<SubscriptionStatus>({
    queryKey: ["subscription", "status"],
    queryFn: getSubscriptionStatus,
    staleTime: 60_000, // 1 minute — don't hammer the API
    retry: 1,
  });

/**
 * Hook to get the current user's subscription/entitlement status.
 * Only runs when the user is authenticated.
 */
export function useSubscriptionStatus() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    ...subscriptionStatusQueryOptions(),
    enabled: isAuthenticated,
  });
}

/**
 * Convenience hook — returns true if the user has an active Pro subscription.
 */
export function useIsPro(): boolean {
  const { data } = useSubscriptionStatus();
  return data?.isPro === true;
}
