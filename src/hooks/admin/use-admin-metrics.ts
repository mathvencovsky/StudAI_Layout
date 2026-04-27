import { useQuery, queryOptions } from "@tanstack/react-query";
import { getAdminMetricsOverview, type AdminMetricsOverview } from "@/api/admin-metrics";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";

export const adminMetricsQueryOptions = () =>
  queryOptions<AdminMetricsOverview>({
    queryKey: ["admin", "metrics", "overview"],
    queryFn: getAdminMetricsOverview,
    staleTime: 5 * 60_000, // 5 minutes
    retry: 1,
  });

export function useAdminMetrics() {
  const { isAdmin } = useIsAdminUser();
  return useQuery({
    ...adminMetricsQueryOptions(),
    enabled: isAdmin,
  });
}
