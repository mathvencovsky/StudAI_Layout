import { sendPasswordResetApi } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const usePasswordReset = () => {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => sendPasswordResetApi(email),
  });
};
