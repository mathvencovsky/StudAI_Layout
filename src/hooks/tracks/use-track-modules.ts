import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import { getTrackModulesStub, Module } from "@/api/stubs/tracks-stub";

export function useTrackModules(trackId: string) {
  return useQuery({
    queryKey: [...queryKeys.tracks.all, trackId, "modules"],
    queryFn: () => getTrackModulesStub(trackId),
    enabled: !!trackId,
    staleTime: 60000, // 1 minuto
  });
}

export type { Module };
