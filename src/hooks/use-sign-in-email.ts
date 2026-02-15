import { signInWithEmailApi } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useSignInWithEmail = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signInWithEmailApi(email, password),
  });
};
