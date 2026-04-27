import { Crown, Sparkles, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { BillingSettingsSection } from "@/components/billing/billing-settings-section";
import { PricingPage } from "@/components/billing/pricing-page";
import { useSubscriptionStatus } from "@/hooks/subscription/use-subscription-status";

/**
 * My Plan page — shows billing management for Pro users,
 * or the full pricing page for Free users.
 */
export function MyPlanPage() {
  const { t } = useTranslation();
  const { data: status } = useSubscriptionStatus();

  // Pro users see a compact billing management view
  if (status?.isPro) {
    return (
      <div className="container mx-auto p-4 sm:p-6 pb-24 md:pb-6 max-w-2xl space-y-6">
        <div className="text-center space-y-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">
            <Sparkles className="w-3 h-3 mr-1" />
            {t("pricing-kicker")}
          </Badge>
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Crown className="w-7 h-7 text-primary" />
            StudAI Pro
          </h1>
          <p className="text-muted-foreground">
            {t("billing-settings-manage-desc")}
          </p>
        </div>

        <BillingSettingsSection />

        <div className="text-center text-sm text-muted-foreground">
          <Shield className="w-4 h-4 inline-block mr-1" />
          {t("pricing-trust-notice")}
        </div>
      </div>
    );
  }

  // Free users see the full pricing page
  return <PricingPage />;
}
