import { useQuery, queryOptions } from "@tanstack/react-query";
import { listLoginDays } from "@/api/user-login-day";

export const loginDaysQueryOptions = () =>
  queryOptions({
    queryKey: ["login-days"],
    queryFn: listLoginDays,
  });

/**
 * Returns all login day date strings for the current user.
 */
export const useListLoginDays = () => useQuery(loginDaysQueryOptions());
