import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrack } from "@/api/track";

/**
 * Hook to create a new track
 */
export const useCreateTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });
};
