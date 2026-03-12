import { useQuery } from "@tanstack/react-query";
import { getSessionsStub, type SessionFilters } from "@/api/stubs/sessions-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useSessions(filters?: SessionFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.SESSIONS, filters],
    queryFn: () => getSessionsStub(filters),
    staleTime: 1000 * 60 * 5,
  });
}
