import { useCognitoGroups } from "@/hooks/use-cognito-groups";

/**
 * Hook to check if the current user is in the Ai group
 */
export const useIsAiUser = () => {
  const { groups, isLoading } = useCognitoGroups();
  return { isAiUser: groups.includes("Ai"), isLoading };
};
