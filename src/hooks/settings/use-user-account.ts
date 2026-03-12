import { useQuery } from "@tanstack/react-query";
import { getUserAccountStub } from "@/api/stubs/settings-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useUserAccount() {
  return useQuery({
    queryKey: [QUERY_KEYS.SETTINGS, "account"],
    queryFn: getUserAccountStub,
    staleTime: 1000 * 60 * 5,
  });
}
