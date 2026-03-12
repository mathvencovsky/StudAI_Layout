import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserProfile, type CreateUserProfileInput } from "@/api/user-profile";

export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserProfileInput) => {
      return await createUserProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};
