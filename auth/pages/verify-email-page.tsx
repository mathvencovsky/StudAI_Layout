import {
  type VerifyEmailFormValues,
  VerifyEmailForm,
} from "@/components/auth/form/verify-email-form";
import { useVerifyEmail } from "@/hooks/use-verify-email";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export interface VerifyEmailPageProps {
  email: string;
}

export const VerifyEmailPage = ({ email }: VerifyEmailPageProps) => {
  const [error, setError] = useState<string | null>(null);
  const mutation = useVerifyEmail();
  const navigate = useNavigate();

  const handleSubmit = async (values: VerifyEmailFormValues) => {
    setError(null);
    try {
      await mutation.mutateAsync({
        email,
        code: values.code,
      });
      navigate({ to: "/" });
    } catch (e) {
      console.error(e);
      setError("Verification failed. Please check your code and try again.");
    }
  };

  return (
    <VerifyEmailForm
      email={email}
      onSubmit={handleSubmit}
      isSubmitting={mutation.isPending}
      errorMessage={error}
    />
  );
};
