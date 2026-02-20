import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import { getActivityFeedStub, type Activity } from "@/api/stubs/activity-stub";

export function useActivityFeed() {
  return useQuery<Activity[]>({
    queryKey: queryKeys.activity.all,
    queryFn: getActivityFeedStub,
    staleTime: 60000, // 1 minuto
  });
}
