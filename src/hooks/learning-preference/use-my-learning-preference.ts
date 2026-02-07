import { useQuery, queryOptions } from "@tanstack/react-query";
import { getMyLearningPreference } from "@/api/learning-preference";

export const getMyLearningPreferenceQueryOptions = () =>
  queryOptions({
    queryKey: ["learning-preference", "mine"],
    queryFn: getMyLearningPreference,
  });

export const useMyLearningPreference = () =>
  useQuery(getMyLearningPreferenceQueryOptions());
