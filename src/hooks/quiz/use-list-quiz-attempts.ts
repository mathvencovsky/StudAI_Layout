import { useQuery, queryOptions } from "@tanstack/react-query";
import { listQuizAttempts } from "@/api/quiz";

export const listQuizAttemptsQueryOptions = () =>
  queryOptions({
    queryKey: ["quiz-attempts", "list"],
    queryFn: async () => {
      try {
        return await listQuizAttempts();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListQuizAttempts = () => useQuery(listQuizAttemptsQueryOptions());
