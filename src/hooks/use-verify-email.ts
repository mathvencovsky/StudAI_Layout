import { verifyEmailApi } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      verifyEmailApi(email, code),
  });
};
