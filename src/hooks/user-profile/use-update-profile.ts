import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile, type UpdateUserProfileInput } from "@/api/user-profile";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateUserProfileInput) => {
      return await updateUserProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};
