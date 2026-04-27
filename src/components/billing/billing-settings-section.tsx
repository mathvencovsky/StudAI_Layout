import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Crown,
  Zap,
  ExternalLink,
  AlertTriangle,
  Loader2,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscriptionStatus } from "@/hooks/subscription/use-subscription-status";
import { getPeriodEndLabel, isCancellingAtPeriodEnd } from "@/lib/subscription-utils";
import { createPortalSession, createCheckoutSession } from "@/api/billing";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function BillingSettingsSection() {
  const { t } = useTranslation();
  const { data: status, isLoading, error, refetch } = useSubscriptionStatus();
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isResubLoading, setIsResubLoading] = useState(false);
  const navigate = useNavigate();

  const handleOpenPortal = async () => {
    setIsPortalLoading(true);
    try {
      const url = await createPortalSession();
      window.location.href = url;
    } catch {
      if (import.meta.env.DEV) {
        toast.info(t("billing-settings-portal-demo"));
        setIsPortalLoading(false);
        return;
      }
      toast.error("Could not open billing portal. Please try again.");
      setIsPortalLoading(false);
    }
  };

  const handleResubscribe = async () => {
    setIsResubLoading(true);
    try {
      const url = await createCheckoutSession("monthly");
      window.location.href = url;
    } catch {
      if (import.meta.env.DEV) {
        toast.info(t("billing-demo-toast"));
        await new Promise((r) => setTimeout(r, 1000));
        void navigate({ to: "/billing/success" });
        return;
      }
      toast.error("Could not start checkout. Please try again.");
      setIsResubLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-40" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">{t("billing-settings-title")}</h2>
        </div>
        <div className="p-4 flex items-center gap-3 text-sm text-muted-foreground">
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
          <span>{t("billing-settings-load-error")}</span>
          <Button variant="ghost" size="sm" onClick={() => void refetch()}>
            <RefreshCw className="w-3 h-3 mr-1" />
            {t("billing-settings-retry")}
          </Button>
        </div>
      </section>
    );
  }

  const isPro = status?.isPro;
  const periodEnd = getPeriodEndLabel(status);
  const cancelling = isCancellingAtPeriodEnd(status);

  // Derive labels from status
  const statusLabel = (() => {
    if (!status) return t("billing-status-free");
    if (status.isPro && status.status === "trial") return t("billing-status-pro-trial");
    if (status.isPro) return t("billing-status-pro");
    if (status.hasPaymentIssue) return t("billing-status-payment-issue");
    if (status.status === "cancelled") return t("billing-status-cancelled");
    return t("billing-status-free");
  })();

  const intervalLabel = (() => {
    if (!status?.billingInterval) return null;
    return status.billingInterval === "annual"
      ? t("billing-interval-annual")
      : t("billing-interval-monthly");
  })();

  return (
    <section className="border rounded-lg bg-card overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-medium text-foreground">{t("billing-settings-title")}</h2>
        {isPro && (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Crown className="w-3 h-3 mr-1" />
            Pro
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Payment issue warning */}
        {status?.hasPaymentIssue && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-destructive">{t("billing-settings-payment-issue-title")}</p>
              <p className="text-muted-foreground">{t("billing-settings-payment-issue-body")}</p>
            </div>
          </div>
        )}

        {/* Cancellation notice */}
        {cancelling && periodEnd && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              {t("billing-settings-cancelling", { date: periodEnd })}
            </p>
          </div>
        )}

        {/* Info rows */}
        <div className="space-y-2">
          <InfoRow
            label={t("billing-settings-label-plan")}
            value={
              <span className="flex items-center gap-1.5">
                {isPro
                  ? <><Crown className="w-3.5 h-3.5 text-primary" />{t("billing-settings-plan-pro")}</>
                  : <><Zap className="w-3.5 h-3.5 text-muted-foreground" />{t("billing-settings-plan-free")}</>
                }
              </span>
            }
          />
          <InfoRow label={t("billing-settings-label-status")} value={statusLabel} />
          {intervalLabel && <InfoRow label={t("billing-settings-label-billing")} value={intervalLabel} />}
          {periodEnd && (
            <InfoRow
              label={cancelling ? t("billing-settings-label-access-until") : t("billing-settings-label-renews")}
              value={periodEnd}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          {status?.canManageBilling && (
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              disabled={isPortalLoading}
              onClick={() => void handleOpenPortal()}
            >
              {isPortalLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" />{t("billing-settings-manage-loading")}</>
                : <><CreditCard className="w-4 h-4" />{t("billing-settings-manage-billing")}<ExternalLink className="w-3 h-3 ml-1 opacity-50" /></>
              }
            </Button>
          )}

          {status?.canResubscribe && (
            <Button
              size="sm"
              className="w-full sm:w-auto"
              disabled={isResubLoading}
              onClick={() => void handleResubscribe()}
            >
              {isResubLoading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Crown className="w-4 h-4" />
              }
              {t("billing-settings-resubscribe")}
            </Button>
          )}

          {!isPro && !status?.canResubscribe && (
            <Button size="sm" className="w-full sm:w-auto" onClick={() => void navigate({ to: "/plans" })}>
              <Crown className="w-4 h-4" />
              {t("billing-settings-upgrade")}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={cn("flex items-center justify-between py-1.5")}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
