import { signUpWithEmailApi } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useSignUpWithEmail = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signUpWithEmailApi(email, password),
  });
};
