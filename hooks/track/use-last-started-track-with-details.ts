import { useLastStartedIncompleteTrack } from "./use-last-started-incomplete-track";
import { useTrack } from "./use-track";
import { type TrackFull } from "@/model/track";

export interface LastStartedTrackWithDetails {
  track: TrackFull;
  startDate: number;
}

/**
 * Hook that fetches the last started incomplete track with full track details
 */
export const useLastStartedTrackWithDetails = () => {
  const lastStartedTrackQuery = useLastStartedIncompleteTrack();
  const trackId = lastStartedTrackQuery.data?.trackId;

  const trackQuery = useTrack(trackId ?? "");

  const isLoading = lastStartedTrackQuery.isLoading || trackQuery.isLoading;
  const isError = lastStartedTrackQuery.isError || trackQuery.isError;
  const isFetching = lastStartedTrackQuery.isFetching || trackQuery.isFetching;

  const data: LastStartedTrackWithDetails | null =
    lastStartedTrackQuery.data && trackQuery.data
      ? {
          track: trackQuery.data,
          startDate: lastStartedTrackQuery.data.startDate,
        }
      : null;

  return {
    data,
    isLoading,
    isError,
    isFetching,
    error: lastStartedTrackQuery.error || trackQuery.error,
  };
};
