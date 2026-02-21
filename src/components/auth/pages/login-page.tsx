import { type LoginFormValues, LoginForm } from "@/components/auth/form/login-form";
import { useSignInWithEmail } from "@/hooks/use-sign-in-email";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export interface LoginPageProps {
  redirect?: string;
}

/**
 * Login page container — manages state and API calls for the login form.
 */
export const LoginPage = ({ redirect }: LoginPageProps) => {
  const [error, setError] = useState<string | null>(null);
  const emailMutation = useSignInWithEmail();
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      await emailMutation.mutateAsync({ email: values.email, password: values.password });
      navigate({ to: redirect || "/" });
    } catch (e) {
      console.error(e);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      isSubmitting={emailMutation.isPending}
      errorMessage={error}
    />
  );
};
