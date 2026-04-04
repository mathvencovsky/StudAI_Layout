import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LoginForm,
  type LoginFormValues,
} from "@/components/auth/form/login-form";
import {
  RegistrationForm,
  type RegistrationFormValues,
} from "@/components/auth/form/registration-form";
import { useSignInWithEmail } from "@/hooks/use-sign-in-email";
import { useSignUpWithEmail } from "@/hooks/use-sign-up-email";
import { useSignInWithGoogle } from "@/hooks/use-sign-in-google";

/**
 * Auth card container component for the landing page.
 * Renders login and registration tabs using the shared form components.
 */
export function AuthCard({ className }: { className?: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("register");
  const [error, setError] = useState<string | null>(null);

  const signInMutation = useSignInWithEmail();
  const signUpMutation = useSignUpWithEmail();
  const googleMutation = useSignInWithGoogle();

  const handleLogin = async (values: LoginFormValues) => {
    setError(null);
    try {
      await signInMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      navigate({ to: "/" });
    } catch (e) {
      console.error(e);
      setError(t("auth-login-error"));
    }
  };

  const handleRegister = async (values: RegistrationFormValues) => {
    setError(null);
    try {
      await signUpMutation.mutateAsync({
        email: values.email,
        password: values.password,
        name: "",
      });
      navigate({ to: "/verify-email", search: { email: values.email } });
    } catch (e) {
      console.error(e);
      setError(t("auth-register-error"));
    }
  };

  return (
    <Card
      className={cn("w-full max-w-md border-2 rounded-3xl shadow-2xl", className)}
      id="auth-card"
    >
      <CardContent className="p-5 sm:p-6">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login" className="font-bold">
              {t("auth-tab-login")}
            </TabsTrigger>
            <TabsTrigger value="register" className="font-bold">
              {t("auth-tab-register")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-5">
            <LoginForm
              onSubmit={handleLogin}
              isSubmitting={signInMutation.isPending}
              errorMessage={tab === "login" ? error : null}
              onGoogleSignIn={() => googleMutation.mutate()}
            />
          </TabsContent>

          <TabsContent value="register" className="mt-5">
            <RegistrationForm
              onSubmit={handleRegister}
              isSubmitting={signUpMutation.isPending}
              errorMessage={tab === "register" ? error : null}
              onGoogleSignIn={() => googleMutation.mutate()}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
