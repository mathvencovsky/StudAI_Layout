import { useQuery, queryOptions } from "@tanstack/react-query";
import { getUserTrackProgress } from "@/api/track-progress";
import { type UserTrackProgress } from "@/model/user-track-progress";

export const getTrackProgressQueryOptions = (trackId: string) =>
  queryOptions<UserTrackProgress | null>({
    queryKey: ["trackProgress", trackId],
    queryFn: () => getUserTrackProgress(trackId),
    enabled: !!trackId,
  });

/**
 * Query hook for fetching user's progress on a specific track
 */
export const useTrackProgress = (trackId: string) =>
  useQuery(getTrackProgressQueryOptions(trackId));
