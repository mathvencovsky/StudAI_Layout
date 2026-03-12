import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudySession, type CreateStudySessionInput } from "@/api/study-session";

export const useCreateStudySession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateStudySessionInput) => {
      return await createStudySession(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
    },
  });
};
