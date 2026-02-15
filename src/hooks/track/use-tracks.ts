import { useQuery, queryOptions } from "@tanstack/react-query";
import { getTracks } from "@/api/track";

/**
 * Query options for fetching all tracks
 */
export const getTracksQueryOptions = () =>
  queryOptions({
    queryKey: ["tracks"],
    queryFn: getTracks,
  });

/**
 * Hook to fetch all tracks
 */
export const useTracks = () => useQuery(getTracksQueryOptions());
