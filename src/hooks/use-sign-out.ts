import { signOutApi } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useSignOut = () => {
  return useMutation({
    mutationFn: () => signOutApi(),
  });
};
