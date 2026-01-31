import { useQuery, queryOptions } from "@tanstack/react-query";
import { getTrack } from "@/api/track";

/**
 * Query options for fetching a single track by ID
 */
export const getTrackQueryOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["track", trackId],
    queryFn: () => getTrack({ id: trackId }),
  });

/**
 * Hook to fetch a single track by ID
 */
export const useTrack = (trackId: string) =>
  useQuery(getTrackQueryOptions(trackId));
