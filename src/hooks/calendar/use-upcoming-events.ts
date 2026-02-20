import { useQuery } from "@tanstack/react-query";
import { getUpcomingEventsStub } from "@/api/stubs/calendar-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useUpcomingEvents(days: number = 7) {
  return useQuery({
    queryKey: [QUERY_KEYS.CALENDAR_EVENTS, days],
    queryFn: () => getUpcomingEventsStub(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
