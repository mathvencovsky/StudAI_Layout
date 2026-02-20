import { useQuery } from "@tanstack/react-query";
import { getEngagementMetricsStub, getWeeklyTrendStub } from "@/api/stubs/engagement-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useEngagementMetrics() {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS, "engagement"],
    queryFn: getEngagementMetricsStub,
    staleTime: 1000 * 60 * 5,
  });
}

export function useWeeklyTrend() {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS, "weekly-trend"],
    queryFn: getWeeklyTrendStub,
    staleTime: 1000 * 60 * 5,
  });
}
