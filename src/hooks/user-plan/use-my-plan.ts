import { useQuery, queryOptions } from "@tanstack/react-query";
import { getMyPlan } from "@/api/user-plan";

export const myPlanQueryOptions = () =>
  queryOptions({
    queryKey: ["user-plan", "me"],
    queryFn: async () => {
      try {
        return await getMyPlan();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useMyPlan = () => useQuery(myPlanQueryOptions());
