import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeTrack } from "@/api/track-progress";

/**
 * Mutation hook to mark a track as completed
 */
export const useCompleteTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeTrack,
    onSuccess: (_, trackId) => {
      queryClient.invalidateQueries({ queryKey: ["trackProgress", trackId] });
      queryClient.invalidateQueries({ queryKey: ["lastStartedIncompleteTrack"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
    onError: (error) => {
      console.error("Failed to complete track:", error);
    },
  });
};
