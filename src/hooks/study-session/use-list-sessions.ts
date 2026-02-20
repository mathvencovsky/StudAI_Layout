import { useQuery, queryOptions } from "@tanstack/react-query";
import { listStudySessions } from "@/api/study-session";

export const listStudySessionsQueryOptions = () =>
  queryOptions({
    queryKey: ["study-sessions", "list"],
    queryFn: async () => {
      try {
        return await listStudySessions();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListStudySessions = () => useQuery(listStudySessionsQueryOptions());
