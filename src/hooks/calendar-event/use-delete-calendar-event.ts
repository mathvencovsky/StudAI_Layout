import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCalendarEvent } from "@/api/calendar-event";
import type { Schema } from "../../../amplify/data/resource";

export const useDeleteCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (identifier: Schema["CalendarEvent"]["identifier"]) => {
      return await deleteCalendarEvent(identifier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
    },
  });
};
