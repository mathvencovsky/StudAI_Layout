import { type LoginFormValues, LoginForm } from "@/components/auth/form/login-form";
import { useSignInWithEmail } from "@/hooks/use-sign-in-email";
import { useSignInWithGoogle } from "@/hooks/use-sign-in-google";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export interface LoginPageProps {
  redirect?: string;
}

/**
 * Validate a redirect target is a safe relative path (no open redirect).
 * Only allows paths starting with "/" and not "//" (protocol-relative).
 */
function safeRedirect(redirect?: string): string {
  if (!redirect) return "/";
  // Must be a relative path — reject absolute URLs and protocol-relative URLs
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return "/";
  // Reject paths with protocol characters
  if (/^\/[a-z]+:/i.test(redirect)) return "/";
  return redirect;
}

/**
 * Login page container — manages state and API calls for the login form.
 */
export const LoginPage = ({ redirect }: LoginPageProps) => {
  const [error, setError] = useState<string | null>(null);
  const emailMutation = useSignInWithEmail();
  const googleMutation = useSignInWithGoogle();
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      await emailMutation.mutateAsync({ email: values.email, password: values.password });
      navigate({ to: safeRedirect(redirect) });
    } catch (e) {
      // Log only in dev — never expose credentials or stack traces
      if (import.meta.env.DEV) console.error("[login]", e);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      isSubmitting={emailMutation.isPending}
      errorMessage={error}
      onGoogleSignIn={() => googleMutation.mutate()}
    />
  );
};
