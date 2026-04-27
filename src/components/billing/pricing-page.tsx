import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  Crown,
  Zap,
  Shield,
  Sparkles,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSubscriptionStatus } from "@/hooks/subscription/use-subscription-status";
import { createCheckoutSession } from "@/api/billing";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import type { BillingPlan } from "@/api/billing";
import { useAnalytics } from "@/hooks/use-analytics";
import { EVENTS } from "@/lib/analytics-events";

export function PricingPage() {
  const { t } = useTranslation();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">("annual");
  const [isLoading, setIsLoading] = useState<BillingPlan | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { data: subStatus } = useSubscriptionStatus();
  const navigate = useNavigate();
  const { track } = useAnalytics();

  // Track pricing page view
  useEffect(() => {
    track(EVENTS.PRICING_PAGE_VIEWED, { source: "plans_page" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthlyPrice = 19;
  const annualMonthlyPrice = 13;
  const annualTotal = annualMonthlyPrice * 12;
  const annualSavings = Math.round(((monthlyPrice - annualMonthlyPrice) / monthlyPrice) * 100);

  const FREE_FEATURES = [
    t("billing-free-feature-1"),
    t("billing-free-feature-2"),
    t("billing-free-feature-3"),
    t("billing-free-feature-4"),
    t("billing-free-feature-5"),
  ];

  const PRO_FEATURES = [
    t("billing-pro-feature-1"),
    t("billing-pro-feature-2"),
    t("billing-pro-feature-3"),
    t("billing-pro-feature-4"),
    t("billing-pro-feature-5"),
    t("billing-pro-feature-6"),
    t("billing-pro-feature-7"),
    t("billing-pro-feature-8"),
  ];

  const handleSubscribe = async (plan: BillingPlan) => {
    if (!isAuthenticated) {
      void navigate({ to: "/sign-up", search: { returnTo: "/plans" } as never });
      return;
    }
    if (subStatus?.isPro) {
      void navigate({ to: "/settings", search: { tab: "billing" } as never });
      return;
    }
    setIsLoading(plan);
    track(EVENTS.CHECKOUT_STARTED, { plan, billingInterval: plan });
    try {
      const url = await createCheckoutSession(plan, user?.email);
      window.location.href = url;
    } catch {
      if (import.meta.env.DEV) {
        toast.info(t("billing-demo-toast"));
        await new Promise((r) => setTimeout(r, 1200));
        void navigate({ to: "/billing/success" });
        return;
      }
      toast.error("Could not start checkout. Please try again.");
      setIsLoading(null);
    }
  };

  const isPro = subStatus?.isPro;
  const selectedPlan: BillingPlan = billingInterval === "annual" ? "annual" : "monthly";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            {t("billing-hero-badge")}
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t("billing-hero-headline")}{" "}
            <span className="text-primary">{t("billing-hero-headline-highlight")}</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("billing-hero-subheadline")}
          </p>
        </div>
      </section>

      {/* Billing toggle */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={cn("text-sm font-medium transition-colors", billingInterval === "monthly" ? "text-foreground" : "text-muted-foreground")}>
            {t("billing-toggle-monthly")}
          </span>
          <button
            role="switch"
            aria-checked={billingInterval === "annual"}
            aria-label={t("billing-toggle-annual")}
            onClick={() => setBillingInterval((v) => v === "monthly" ? "annual" : "monthly")}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              billingInterval === "annual" ? "bg-primary" : "bg-muted",
            )}
          >
            <span className={cn("inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform", billingInterval === "annual" ? "translate-x-6" : "translate-x-1")} />
          </button>
          <span className={cn("text-sm font-medium transition-colors flex items-center gap-2", billingInterval === "annual" ? "text-foreground" : "text-muted-foreground")}>
            {t("billing-toggle-annual")}
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
              {t("billing-save-badge", { percent: annualSavings })}
            </Badge>
          </span>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-2 gap-8 items-start mb-16">
          {/* Free */}
          <div className="rounded-2xl border-2 border-border bg-card p-8 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Zap className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t("billing-free-title")}</h2>
                  <p className="text-sm text-muted-foreground">{t("billing-free-tagline")}</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{t("billing-free-price")}</span>
                <span className="text-muted-foreground">{t("billing-free-price-period")}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              disabled={isAuthenticated && !isPro}
              onClick={() => void navigate({ to: "/" })}
            >
              {!isAuthenticated
                ? t("billing-free-cta-signup")
                : isPro
                  ? t("billing-free-cta-downgrade")
                  : t("billing-free-cta-current")}
            </Button>

            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl border-2 border-primary bg-card p-8 flex flex-col gap-6 shadow-lg shadow-primary/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm shadow-md">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {billingInterval === "annual" ? t("billing-best-value-badge") : t("billing-most-popular-badge")}
              </Badge>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t("billing-pro-title")}</h2>
                  <p className="text-sm text-muted-foreground">{t("billing-pro-tagline")}</p>
                </div>
              </div>

              {billingInterval === "annual" ? (
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${annualMonthlyPrice}</span>
                    <span className="text-muted-foreground">{t("billing-pro-price-period")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("billing-pro-billed-annually", { total: annualTotal })}
                  </p>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${monthlyPrice}</span>
                  <span className="text-muted-foreground">{t("billing-pro-price-period")}</span>
                </div>
              )}
            </div>

            <Button size="lg" className="w-full" disabled={!!isLoading} onClick={() => void handleSubscribe(selectedPlan)}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("billing-pro-cta-loading")}
                </>
              ) : isPro ? (
                t("billing-pro-cta-manage")
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {isAuthenticated ? t("billing-pro-cta-upgrade") : t("billing-pro-cta-get-started")}
                </>
              )}
            </Button>

            {!isPro && (
              <p className="text-xs text-center text-muted-foreground">
                {t("billing-pro-no-commitment")}
              </p>
            )}

            <ul className="space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ComparisonTable />
        <FaqSection />
        <TrustSection />
      </section>
    </div>
  );
}

function ComparisonTable() {
  const { t } = useTranslation();

  const rows = [
    { feature: t("billing-comparison-ai-sessions"), free: t("billing-comparison-ai-sessions-free"), pro: t("billing-comparison-ai-sessions-pro") },
    { feature: t("billing-comparison-flashcards"), free: t("billing-comparison-flashcards-free"), pro: t("billing-comparison-flashcards-pro") },
    { feature: t("billing-comparison-plans"), free: t("billing-comparison-plans-free"), pro: t("billing-comparison-plans-pro") },
    { feature: t("billing-comparison-analytics"), free: t("billing-comparison-analytics-free"), pro: t("billing-comparison-analytics-pro") },
    { feature: t("billing-comparison-export"), free: t("billing-comparison-export-free"), pro: t("billing-comparison-export-pro") },
    { feature: t("billing-comparison-speed"), free: t("billing-comparison-speed-free"), pro: t("billing-comparison-speed-pro") },
    { feature: t("billing-comparison-support"), free: t("billing-comparison-support-free"), pro: t("billing-comparison-support-pro") },
    { feature: t("billing-comparison-new-features"), free: t("billing-comparison-new-features-free"), pro: t("billing-comparison-new-features-pro") },
  ];

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-center mb-8">{t("billing-comparison-title")}</h2>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4 font-medium">{t("billing-comparison-feature")}</th>
              <th className="text-center p-4 font-medium">{t("billing-comparison-free")}</th>
              <th className="text-center p-4 font-medium text-primary">{t("billing-comparison-pro")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.feature} className={cn("border-b last:border-0", i % 2 === 0 && "bg-muted/20")}>
                <td className="p-4 text-muted-foreground">{row.feature}</td>
                <td className="p-4 text-center text-muted-foreground">{row.free}</td>
                <td className="p-4 text-center font-medium text-primary">{row.pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FaqSection() {
  const { t } = useTranslation();

  const FAQ_ITEMS = [
    { q: t("billing-faq-1-q"), a: t("billing-faq-1-a") },
    { q: t("billing-faq-2-q"), a: t("billing-faq-2-a") },
    { q: t("billing-faq-3-q"), a: t("billing-faq-3-a") },
    { q: t("billing-faq-4-q"), a: t("billing-faq-4-a") },
    { q: t("billing-faq-5-q"), a: t("billing-faq-5-a") },
    { q: t("billing-faq-6-q"), a: t("billing-faq-6-a") },
  ];

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-center mb-8">{t("billing-faq-title")}</h2>
      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {FAQ_ITEMS.map((item) => (
          <div key={item.q} className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-2">{item.q}</h3>
            <p className="text-sm text-muted-foreground">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustSection() {
  const { t } = useTranslation();

  return (
    <div className="mb-16 text-center space-y-4">
      <div className="inline-flex flex-col sm:flex-row items-center gap-6 px-8 py-6 rounded-2xl border bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-5 h-5 text-green-500 shrink-0" />
          <span>{t("billing-trust-stripe")}</span>
        </div>
        <div className="hidden sm:block w-px h-6 bg-border" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
          <span>{t("billing-trust-no-card")}</span>
        </div>
        <div className="hidden sm:block w-px h-6 bg-border" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="w-5 h-5 text-primary shrink-0" />
          <span>{t("billing-trust-cancel")}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <a href="/refund-policy" className="hover:text-foreground hover:underline transition-colors">
          Política de Reembolso
        </a>
        <span>·</span>
        <a href="/ai-disclaimer" className="hover:text-foreground hover:underline transition-colors">
          AI Disclaimer
        </a>
        <span>·</span>
        <a href="/terms" className="hover:text-foreground hover:underline transition-colors">
          Termos de Uso
        </a>
      </div>
    </div>
  );
}
