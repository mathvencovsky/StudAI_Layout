import { useQuery } from "@tanstack/react-query";
import { getReportDataStub, type ReportPeriod } from "@/api/stubs/reports-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useReportData(period: ReportPeriod = "week") {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, period],
    queryFn: () => getReportDataStub(period),
    staleTime: 1000 * 60 * 5,
  });
}
