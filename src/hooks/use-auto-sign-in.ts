import { autoSignInApi } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useAutoSignIn = () => {
  return useMutation({
    mutationFn: autoSignInApi,
  });
};
