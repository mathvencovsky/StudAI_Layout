import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import { getTracksCatalogStub, Track } from "@/api/stubs/tracks-stub";

export function useTracksCatalog(filters?: {
  category?: string;
  difficulty?: string;
  duration?: string;
}) {
  return useQuery({
    queryKey: queryKeys.tracks.catalog(filters),
    queryFn: () => getTracksCatalogStub(filters),
    staleTime: 300000, // 5 minutos
  });
}

export type { Track };
