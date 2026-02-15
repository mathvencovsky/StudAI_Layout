import { useCognitoGroups } from "@/hooks/use-cognito-groups";

/**
 * Hook to check if the current user is an admin by checking Cognito groups
 */
export const useIsAdminUser = () => {
  const { groups, isLoading } = useCognitoGroups();
  return { isAdmin: groups.includes("Admin"), isLoading };
};
