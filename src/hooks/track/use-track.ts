import { useQuery, queryOptions } from "@tanstack/react-query";
import { getTrack } from "@/api/track";
import { getTrackStub } from "@/api/stubs/tracks-stub";

// Use stub implementation for development
const USE_STUBS = true;

/**
 * Query options for fetching a single track by ID
 */
export const getTrackQueryOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["track", trackId],
    queryFn: () => USE_STUBS ? getTrackStub(trackId) : getTrack({ id: trackId }),
    enabled: !!trackId,
  });

/**
 * Hook to fetch a single track by ID
 */
export const useTrack = (trackId: string) =>
  useQuery(getTrackQueryOptions(trackId));
