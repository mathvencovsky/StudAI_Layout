import { useQuery } from "@tanstack/react-query";
import { getContentsStub } from "@/api/stubs/contents-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useContents(type?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN, "contents", type],
    queryFn: () => getContentsStub(type),
    staleTime: 1000 * 60 * 5,
  });
}
