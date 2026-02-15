import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uncompleteTrack } from "@/api/track-progress";

/**
 * Mutation hook to mark a track as incomplete
 */
export const useUncompleteTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uncompleteTrack,
    onSuccess: (_, trackId) => {
      queryClient.invalidateQueries({ queryKey: ["trackProgress", trackId] });
      queryClient.invalidateQueries({
        queryKey: ["lastStartedIncompleteTrack"],
      });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
    onError: (error) => {
      console.error("Failed to mark track as incomplete:", error);
    },
  });
};
