import { useQuery, queryOptions } from "@tanstack/react-query";
import { getMyProfile } from "@/api/user-profile";

export const myProfileQueryOptions = () =>
  queryOptions({
    queryKey: ["user-profile", "me"],
    queryFn: async () => {
      try {
        return await getMyProfile();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useMyProfile = () => useQuery(myProfileQueryOptions());
