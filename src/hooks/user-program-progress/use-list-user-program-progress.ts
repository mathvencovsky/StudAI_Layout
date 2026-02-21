import { useQuery, queryOptions } from "@tanstack/react-query";
import { listUserProgramProgress } from "@/api/user-program-progress";

export const listUserProgramProgressQueryOptions = () =>
  queryOptions({
    queryKey: ["user-program-progress", "list"],
    queryFn: async () => {
      try {
        return await listUserProgramProgress();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListUserProgramProgress = () =>
  useQuery(listUserProgramProgressQueryOptions());
