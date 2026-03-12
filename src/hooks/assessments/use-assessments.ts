import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import { getAssessmentsStub, Assessment } from "@/api/stubs/assessments-stub";

export function useAssessments() {
  return useQuery({
    queryKey: queryKeys.assessments.list,
    queryFn: getAssessmentsStub,
    staleTime: 60000, // 1 minuto
  });
}

export type { Assessment };
