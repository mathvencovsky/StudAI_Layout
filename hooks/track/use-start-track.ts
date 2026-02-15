import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startTrack } from "@/api/track-progress";

/**
 * Mutation hook to start a track for the current user
 */
export const useStartTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startTrack,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["trackProgress", data.trackId],
      });
      queryClient.invalidateQueries({
        queryKey: ["lastStartedIncompleteTrack"],
      });
    },
    onError: (error) => {
      console.error("Failed to start track:", error);
    },
  });
};
