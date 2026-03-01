import { VerifyEmailForm } from "@/components/auth/form/verify-email-form";
import { autoSignInApi } from "@/api/auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const POLL_INTERVAL_MS = 3000;

export interface VerifyEmailPageProps {
  email: string;
}

export const VerifyEmailPage = ({ email }: VerifyEmailPageProps) => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    let stopped = false;

    const tryAutoSignIn = async () => {
      try {
        await autoSignInApi();
        navigate({ to: "/" });
      } catch (e) {
        const message = e instanceof Error ? e.message : "";
        if (message.toLowerCase().includes("expired")) {
          setError(t("verify-email-sign-in-error"));
          stopped = true;
        }
      }
    };

    tryAutoSignIn();
    const interval = setInterval(() => {
      if (!stopped) tryAutoSignIn();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [navigate, t]);

  return <VerifyEmailForm email={email} errorMessage={error} />;
};
