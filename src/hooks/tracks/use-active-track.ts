import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import { getActiveTrackStub, Track } from "@/api/stubs/tracks-stub";

export function useActiveTrack() {
  return useQuery({
    queryKey: queryKeys.tracks.active,
    queryFn: getActiveTrackStub,
    staleTime: 60000, // 1 minuto
  });
}

export type { Track };
