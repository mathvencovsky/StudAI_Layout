import { useQuery } from "@tanstack/react-query";
import { getTracksQueryOptions } from "@/hooks/track/use-tracks";
import { type TrackCategory } from "@/model/track";

/**
 * Fetches all tracks and filters by categories using OR logic.
 * Returns all tracks when categories is undefined or empty.
 */
export const useTracksByCategories = (categories: TrackCategory[] | undefined) =>
  useQuery({
    ...getTracksQueryOptions(),
    select: (tracks) => {
      if (!categories?.length) return tracks;
      return tracks.filter((track) =>
        track.categories?.some(
          (category) => category !== null && categories.includes(category)
        )
      );
    },
  });
