import {
  type LoginFormValues,
  LoginForm,
} from "@/components/auth/form/login-form";
import { useSignInWithEmail } from "@/hooks/use-sign-in-email";
import { useSignInWithGoogle } from "@/hooks/use-sign-in-google";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export interface LoginPageProps {
  redirect?: string;
}

export const LoginPage = ({ redirect }: LoginPageProps) => {
  const [error, setError] = useState<string | null>(null);
  const emailMutation = useSignInWithEmail();
  const googleMutation = useSignInWithGoogle();
  const navigate = useNavigate();

  const handleSignUp = () => navigate({ to: "/sign-up" });
  const handleSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      await emailMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      navigate({ to: redirect || "/" });
    } catch (e) {
      console.error(e);
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await googleMutation.mutateAsync();
      navigate({ to: redirect || "/" });
    } catch (e) {
      console.error(e);
      setError("Google sign-in was cancelled or failed.");
    }
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      onGoogle={handleGoogle}
      onSignUp={handleSignUp}
      onForgotPassword={() => navigate({ to: "/reset-password" })}
      isSubmitting={emailMutation.isPending || googleMutation.isPending}
      errorMessage={error}
    />
  );
};
