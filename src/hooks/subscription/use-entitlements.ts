/**
 * useEntitlements — subscription-aware entitlement hooks.
 *
 * These hooks are the frontend's single source of truth for plan access.
 * They fetch from the backend entitlements endpoint, which reads from the
 * authoritative DynamoDB subscription store (updated by Stripe webhooks).
 *
 * IMPORTANT: Frontend checks are for UX only. The backend always enforces.
 */

import { useQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEntitlements,
  startAiSession,
  type Entitlements,
  type FeatureKey,
  type FeatureAccess,
} from "@/api/entitlements";
import { useAuth } from "@/hooks/use-auth";

// ─── Query options ────────────────────────────────────────────────────────────

export const entitlementsQueryOptions = () =>
  queryOptions<Entitlements>({
    queryKey: ["entitlements"],
    queryFn: getEntitlements,
    staleTime: 60_000, // 1 minute
    retry: 1,
  });

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Returns the full entitlement object for the current user.
 * Includes plan, isPro, and per-feature access/limits/usage.
 */
export function useEntitlements() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    ...entitlementsQueryOptions(),
    enabled: isAuthenticated,
  });
}

/**
 * Returns access info for a specific feature key.
 * Falls back to a disabled state while loading.
 */
export function useFeatureAccess(featureKey: FeatureKey): FeatureAccess & { isLoading: boolean } {
  const { data, isLoading } = useEntitlements();

  if (isLoading || !data) {
    return { enabled: false, isLoading: true };
  }

  return { ...data.features[featureKey], isLoading: false };
}

/**
 * Returns true if the current user has an active Pro subscription.
 * Derived from the entitlements endpoint (authoritative).
 */
export function useIsPro(): boolean {
  const { data } = useEntitlements();
  return data?.isPro === true;
}

/**
 * Returns the current plan ("free" | "pro").
 */
export function usePlan(): "free" | "pro" | undefined {
  const { data } = useEntitlements();
  return data?.plan;
}

/**
 * Returns AI session usage info for the current user.
 * Useful for displaying remaining sessions in the UI.
 */
export function useAiSessionUsage(): {
  used: number;
  remaining: number;
  limit: number | null;
  unlimited: boolean;
  isLoading: boolean;
} {
  const { data, isLoading } = useEntitlements();

  if (isLoading || !data) {
    return { used: 0, remaining: 0, limit: null, unlimited: false, isLoading: true };
  }

  const f = data.features.aiStudySessions;
  return {
    used: f.used ?? 0,
    remaining: f.remaining ?? 0,
    limit: f.limit ?? null,
    unlimited: f.unlimited === true,
    isLoading: false,
  };
}

/**
 * Mutation hook to start an AI study session.
 * Calls the server to atomically check and increment usage.
 * Invalidates entitlements cache on success so usage counts refresh.
 */
export function useStartAiSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startAiSession,
    onSuccess: () => {
      // Refresh entitlements so remaining count updates in the UI
      void queryClient.invalidateQueries({ queryKey: ["entitlements"] });
    },
  });
}

/**
 * useSubscription — alias for useEntitlements.
 * Provides the same data under the name specified in the product spec.
 */
export const useSubscription = useEntitlements;
