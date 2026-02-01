import { signOutApi } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => signOutApi(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
