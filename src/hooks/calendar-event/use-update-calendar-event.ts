import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCalendarEvent, type UpdateCalendarEventInput } from "@/api/calendar-event";

export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateCalendarEventInput) => {
      return await updateCalendarEvent(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
    },
  });
};
