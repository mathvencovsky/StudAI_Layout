import { useQuery, queryOptions } from "@tanstack/react-query";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  registeredAt: string;
  lastLogin: string;
  status: "active" | "inactive";
  role: "user" | "admin";
}

/**
 * Hook to list admin users.
 * Note: Cognito listUsers requires admin credentials not available client-side.
 * Returns empty result until a server-side Lambda is implemented.
 */
export function useAdminUsers(_filters?: { search?: string; page?: number }) {
  return useQuery(
    queryOptions({
      queryKey: ["admin", "users"],
      queryFn: async (): Promise<{ users: AdminUser[]; total: number }> => {
        return { users: [], total: 0 };
      },
    }),
  );
}
