import { useQuery } from "@tanstack/react-query";
import { getUserPreferencesStub } from "@/api/stubs/settings-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useUserPreferences() {
  return useQuery({
    queryKey: [QUERY_KEYS.SETTINGS, "preferences"],
    queryFn: getUserPreferencesStub,
    staleTime: 1000 * 60 * 5,
  });
}
