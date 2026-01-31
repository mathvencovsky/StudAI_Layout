import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

/**
 * Hook to check if the current user is an admin by checking Cognito groups
 */
export const useIsAdminUser = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (loading) return;

    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const session = await fetchAuthSession({ forceRefresh: true });
        const groups =
          (session.tokens?.accessToken?.payload?.["cognito:groups"] as
            | string[]
            | undefined) ?? [];
        setIsAdmin(groups.includes("Admin"));
      } catch {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, loading]);

  return isAdmin;
};
