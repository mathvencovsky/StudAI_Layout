/**
 * useAnalytics — frontend analytics hook.
 *
 * Provides a stable `track` function that:
 * - Includes the current user's plan automatically.
 * - Validates event names against the registry.
 * - Sanitizes metadata.
 * - Fails silently — analytics never break UX.
 *
 * Usage:
 *   const { track } = useAnalytics();
 *   track(EVENTS.PRICING_PAGE_VIEWED, { source: "navbar" });
 */

import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePlan } from "@/hooks/subscription/use-entitlements";
import { trackClientEvent, type AnalyticsMetadata } from "@/api/analytics";
import type { EventName } from "@/lib/analytics-events";

export function useAnalytics() {
  const { user } = useAuth();
  const plan = usePlan();

  const track = useCallback(
    (eventName: EventName, metadata: AnalyticsMetadata = {}) => {
      // Include plan in every event automatically
      const enriched: AnalyticsMetadata = {
        ...metadata,
        plan: plan ?? "free",
      };
      void trackClientEvent(eventName, enriched);
    },
    [plan, user?.id],
  );

  return { track };
}

/**
 * useTrackEvent — convenience hook that returns a pre-bound track function
 * for a specific event. Useful for one-off event tracking in components.
 *
 * Usage:
 *   const trackPricingView = useTrackEvent(EVENTS.PRICING_PAGE_VIEWED);
 *   useEffect(() => { trackPricingView({ source: "plans_page" }); }, []);
 */
export function useTrackEvent(eventName: EventName) {
  const { track } = useAnalytics();
  return useCallback(
    (metadata: AnalyticsMetadata = {}) => track(eventName, metadata),
    [track, eventName],
  );
}
