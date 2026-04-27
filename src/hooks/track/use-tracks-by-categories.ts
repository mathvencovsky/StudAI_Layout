import { useQuery } from "@tanstack/react-query";
import { getTracksQueryOptions } from "@/hooks/track/use-tracks";
import { type Category } from "@/model/category";

/**
 * Fetches all tracks and filters by categories using OR logic.
 * Returns all tracks when categories is undefined or empty.
 */
export const useTracksByCategories = (categories: Category[] | undefined) =>
  useQuery({
    ...getTracksQueryOptions(),
    select: (tracks) => {
      if (!categories?.length) return tracks;
      return tracks.filter((track) => {
        const t = track as typeof track & { categories?: (string | null)[] };
        return t.categories?.some(
          (category) => category !== null && categories.includes(category as Category),
        );
      });
    },
  });
