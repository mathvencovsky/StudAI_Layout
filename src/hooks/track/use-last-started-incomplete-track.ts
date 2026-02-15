import { useQuery, queryOptions } from "@tanstack/react-query";
import { getLastStartedIncompleteTrack } from "@/api/track-progress";
import { type UserTrackProgress } from "@/model/user-track-progress";

export const getLastStartedIncompleteTrackQueryOptions = () =>
  queryOptions<UserTrackProgress | null>({
    queryKey: ["lastStartedIncompleteTrack"],
    queryFn: getLastStartedIncompleteTrack,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

/**
 * Query hook for fetching the user's most recently started incomplete track
 */
export const useLastStartedIncompleteTrack = () =>
  useQuery(getLastStartedIncompleteTrackQueryOptions());
