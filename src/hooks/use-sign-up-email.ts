import { signUpWithEmailApi } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useSignUpWithEmail = () => {
  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => signUpWithEmailApi(email, password, name),
  });
};
