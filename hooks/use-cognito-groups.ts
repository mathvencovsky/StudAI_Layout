import { fetchAuthSession } from "aws-amplify/auth";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

const fetchCognitoGroups = async (): Promise<string[]> => {
  const session = await fetchAuthSession({ forceRefresh: true });
  return (
    (session.tokens?.accessToken?.payload?.["cognito:groups"] as
      | string[]
      | undefined) ?? []
  );
};

export const getCognitoGroupsQueryOptions = () => {
  return queryOptions({
    queryKey: ["cognito-groups"],
    queryFn: fetchCognitoGroups,
  });
};

/**
 * Hook to get the current user's Cognito groups
 */
export const useCognitoGroups = () => {
  const { user } = useAuth();
  const { data: groups = [], isLoading } = useQuery({
    ...getCognitoGroupsQueryOptions(),
    enabled: !!user,
  });

  return { groups, isLoading };
};
