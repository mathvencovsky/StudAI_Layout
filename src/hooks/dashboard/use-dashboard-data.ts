import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import { getDashboardDataStub } from "@/api/stubs/dashboard-stub";

export function useDashboardData() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboardDataStub,
    staleTime: 60000, // 1 minuto
    refetchOnWindowFocus: true,
  });
}
