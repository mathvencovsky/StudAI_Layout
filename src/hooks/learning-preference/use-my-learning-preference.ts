import { useQuery, queryOptions } from "@tanstack/react-query";
import { getMyLearningPreference } from "@/api/learning-preference";

export const getMyLearningPreferenceQueryOptions = () =>
  queryOptions({
    queryKey: ["learning-preference", "mine"],
    queryFn: getMyLearningPreference,
    staleTime: 5 * 60 * 1000, // 5 min — rarely changes
    gcTime: 10 * 60 * 1000,
  });

export const useMyLearningPreference = () =>
  useQuery(getMyLearningPreferenceQueryOptions());
