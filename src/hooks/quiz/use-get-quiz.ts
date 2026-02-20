import { useQuery, queryOptions } from "@tanstack/react-query";
import { getQuiz } from "@/api/quiz";
import type { Schema } from "../../../amplify/data/resource";

export const getQuizQueryOptions = (identifier: Schema["Quiz"]["identifier"]) =>
  queryOptions({
    queryKey: ["quizzes", identifier.id],
    queryFn: async () => {
      try {
        return await getQuiz(identifier);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

export const useGetQuiz = (identifier: Schema["Quiz"]["identifier"]) =>
  useQuery(getQuizQueryOptions(identifier));
