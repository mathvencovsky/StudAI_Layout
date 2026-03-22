import { useQuery } from "@tanstack/react-query";
import { getTrack } from "@/api/track";

export function useTrack(trackId: string) {
  return useQuery({
    queryKey: ["track", trackId],
    queryFn: () => getTrack({ id: trackId }),
    enabled: !!trackId,
  });
}
