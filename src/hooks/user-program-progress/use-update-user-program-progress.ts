import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProgramProgress } from "@/api/user-program-progress";
import { type UserProgramProgressUpdateInput } from "@/model/user-program-progress";

export const useUpdateUserProgramProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UserProgramProgressUpdateInput) => {
      return await updateUserProgramProgress(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-program-progress"] });
    },
  });
};
