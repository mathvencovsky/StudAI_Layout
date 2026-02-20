import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import { getAdminUsersStub, AdminUser } from "@/api/stubs/admin-stub";

export function useAdminUsers(filters?: { search?: string; page?: number }) {
  return useQuery({
    queryKey: [...queryKeys.admin.users, filters],
    queryFn: () => getAdminUsersStub(filters),
    staleTime: 30000, // 30 segundos
  });
}

export type { AdminUser };
