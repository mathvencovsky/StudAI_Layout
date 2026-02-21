import { useQuery, queryOptions } from "@tanstack/react-query";
import { listAssessments } from "@/api/assessment";

export const listAssessmentsQueryOptions = () =>
  queryOptions({
    queryKey: ["assessments", "list"],
    queryFn: async () => {
      try {
        return await listAssessments();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListAssessments = () => useQuery(listAssessmentsQueryOptions());
