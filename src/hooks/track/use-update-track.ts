import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTrack } from "@/api/track";

/**
 * Hook to update an existing track
 */
export const useUpdateTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTrack,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["track", data.id] });
    },
  });
};
