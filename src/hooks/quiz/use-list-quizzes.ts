import { useQuery, queryOptions } from "@tanstack/react-query";
import { listQuizzes } from "@/api/quiz";

export const listQuizzesQueryOptions = () =>
  queryOptions({
    queryKey: ["quizzes", "list"],
    queryFn: async () => {
      try {
        return await listQuizzes();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useListQuizzes = () => useQuery(listQuizzesQueryOptions());
