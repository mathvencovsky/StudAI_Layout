import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, Loader2, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { subscriptionStatusQueryOptions } from "@/hooks/subscription/use-subscription-status";
import { getSubscriptionStatus } from "@/api/billing";

type State = "loading" | "active" | "pending";

export function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const [state, setState] = useState<State>("loading");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const search = useSearch({ strict: false }) as { session_id?: string };
  void search;

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(() => setState("active"), 1500);
      return;
    }

    let attempts = 0;
    const maxAttempts = 8;
    const intervalMs = 2000;

    const poll = async () => {
      try {
        const status = await getSubscriptionStatus();
        if (status.isPro) {
          queryClient.setQueryData(subscriptionStatusQueryOptions().queryKey, status);
          setState("active");
          return;
        }
      } catch {
        // ignore transient errors
      }
      attempts++;
      if (attempts >= maxAttempts) {
        setState("pending");
        return;
      }
      setTimeout(() => void poll(), intervalMs);
    };

    void poll();
  }, [queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {state === "loading" && (
          <>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{t("billing-success-confirming-title")}</h1>
              <p className="text-muted-foreground">{t("billing-success-confirming-desc")}</p>
            </div>
          </>
        )}

        {state === "active" && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{t("billing-success-active-title")}</h1>
              <p className="text-muted-foreground">{t("billing-success-active-desc")}</p>
            </div>
            <div className="rounded-xl border bg-card p-6 text-left space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <Crown className="w-5 h-5 text-primary" />
                {t("billing-success-unlocked-title")}
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t("billing-success-unlocked-1")}</li>
                <li>{t("billing-success-unlocked-2")}</li>
                <li>{t("billing-success-unlocked-3")}</li>
                <li>{t("billing-success-unlocked-4")}</li>
              </ul>
            </div>
            <Button size="lg" className="w-full" onClick={() => void navigate({ to: "/" })}>
              {t("billing-success-cta-study")}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void navigate({ to: "/settings", search: { tab: "billing" } as never })}
            >
              {t("billing-success-cta-billing")}
            </Button>
          </>
        )}

        {state === "pending" && (
          <>
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{t("billing-success-pending-title")}</h1>
              <p className="text-muted-foreground">{t("billing-success-pending-desc")}</p>
            </div>
            <div className="rounded-xl border bg-muted/50 p-4 text-sm text-muted-foreground">
              {t("billing-success-pending-note")}{" "}
              <a href="mailto:support@studai.app" className="text-primary hover:underline">
                support@studai.app
              </a>
              .
            </div>
            <Button size="lg" className="w-full" onClick={() => void navigate({ to: "/" })}>
              {t("billing-success-pending-cta")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
