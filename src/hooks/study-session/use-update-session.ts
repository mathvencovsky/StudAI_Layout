import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudySession, type UpdateStudySessionInput } from "@/api/study-session";

export const useUpdateStudySession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateStudySessionInput) => {
      return await updateStudySession(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
    },
  });
};
