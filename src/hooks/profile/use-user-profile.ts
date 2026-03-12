import { useQuery } from "@tanstack/react-query";
import { getUserProfileStub, getUserBadgesStub } from "@/api/stubs/profile-stub";
import { QUERY_KEYS } from "@/api/query-keys";

export function useUserProfile() {
  return useQuery({
    queryKey: [QUERY_KEYS.SETTINGS, "profile"],
    queryFn: getUserProfileStub,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserBadges() {
  return useQuery({
    queryKey: [QUERY_KEYS.SETTINGS, "badges"],
    queryFn: getUserBadgesStub,
    staleTime: 1000 * 60 * 5,
  });
}
