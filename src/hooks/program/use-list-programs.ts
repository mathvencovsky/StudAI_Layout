import { useQuery, queryOptions } from "@tanstack/react-query";
import { listPrograms } from "@/api/program";

export const listProgramsQueryOptions = () =>
  queryOptions({
    queryKey: ["programs", "list"],
    queryFn: async () => {
      try {
        return await listPrograms();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListPrograms = () => useQuery(listProgramsQueryOptions());
