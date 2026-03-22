import { useQuery, queryOptions } from "@tanstack/react-query";
import { listCalendarEvents } from "@/api/calendar-event";

export const listCalendarEventsQueryOptions = () =>
  queryOptions({
    queryKey: ["calendar-events", "list"],
    queryFn: async () => {
      try {
        return await listCalendarEvents();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListCalendarEvents = () => useQuery(listCalendarEventsQueryOptions());
