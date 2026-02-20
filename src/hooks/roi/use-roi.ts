import { useQuery } from "@tanstack/react-query";
import { getROIMetricsStub, getModuleEfficiencyStub } from "@/api/stubs/roi-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useROIMetrics() {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS, "roi"],
    queryFn: getROIMetricsStub,
    staleTime: 1000 * 60 * 5,
  });
}

export function useModuleEfficiency() {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS, "module-efficiency"],
    queryFn: getModuleEfficiencyStub,
    staleTime: 1000 * 60 * 5,
  });
}
