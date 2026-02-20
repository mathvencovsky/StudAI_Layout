import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuizAttempt, type CreateQuizAttemptInput } from "@/api/quiz";

export const useCreateQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateQuizAttemptInput) => {
      return await createQuizAttempt(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-attempts"] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
};
