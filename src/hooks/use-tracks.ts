import { useQuery } from "@tanstack/react-query";
import { getTracks } from "@/api/track";

export function useTracks() {
  return useQuery({
    queryKey: ["tracks"],
    queryFn: getTracks,
  });
}
