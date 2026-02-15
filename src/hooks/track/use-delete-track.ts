import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrack } from "@/api/track";
import { type TrackIdentifier } from "@/model/track";

/**
 * Hook to delete a track
 */
export const useDeleteTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (identifier: TrackIdentifier) => deleteTrack(identifier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });
};
