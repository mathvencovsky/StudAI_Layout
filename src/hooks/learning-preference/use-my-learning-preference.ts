import { useQuery, queryOptions } from "@tanstack/react-query";
import { getMyLearningPreference } from "@/api/learning-preference";

const LOCAL_PREF_KEY = "studai:learning-preference";

export const getMyLearningPreferenceQueryOptions = () =>
  queryOptions({
    queryKey: ["learning-preference", "mine"],
    queryFn: async () => {
      // Try backend first
      try {
        const remote = await getMyLearningPreference();
        if (remote) return remote;
      } catch {
        // Backend unavailable — fall through to localStorage
      }
      // Fall back to localStorage
      try {
        const local = localStorage.getItem(LOCAL_PREF_KEY);
        if (local) return JSON.parse(local);
      } catch {
        // localStorage unavailable
      }
      return null;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useMyLearningPreference = () =>
  useQuery(getMyLearningPreferenceQueryOptions());
