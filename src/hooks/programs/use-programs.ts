import { useQuery } from "@tanstack/react-query";
import { getProgramsStub } from "@/api/stubs/programs-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function usePrograms() {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN, "programs"],
    queryFn: getProgramsStub,
    staleTime: 1000 * 60 * 5,
  });
}
