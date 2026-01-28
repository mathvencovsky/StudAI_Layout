import { useAuth } from "@/hooks/use-auth";
import { useMemo } from "react";

// Hard coding this just to hide in the UI
// Even if non admin users see the pages from these, the backend should block them from performing actions
const adminIds = [
  "yiK5uEKnIDVasOQIeIQ6s0IXYlk1",
  "jKb8DeqQZ1VvApXSSAWXGmtVbJ32",
];

export const useIsAdminUser = () => {
  const { user } = useAuth();
  return useMemo(() => user && adminIds.includes(user.id), [user]);
};
