import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCalendarEvent, type CreateCalendarEventInput } from "@/api/calendar-event";

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCalendarEventInput) => {
      return await createCalendarEvent(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
    },
  });
};
