import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Sparkles,
  Crown,
  Zap,
  TrendingUp,
  Shield,
  Users,
  Infinity,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useMyAiWaitlist } from "@/hooks/ai-waitlist/use-my-ai-waitlist";
import { useCreateAiWaitlist } from "@/hooks/ai-waitlist/use-create-ai-waitlist";

export function MyPlanPage() {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const currentPlan = "free"; // Mock - in production this would come from a hook

  const { data: waitlistEntry } = useMyAiWaitlist();
  const { mutate: joinWaitlist, isPending: isJoining } = useCreateAiWaitlist();
  const isOnWaitlist = !!waitlistEntry;

  const plans = [
    {
      id: "free",
      name: t("pricing-free-name"),
      tagline: t("pricing-free-tagline"),
      price: t("pricing-free-price"),
      period: t("pricing-free-forever"),
      description: t("pricing-free-desc"),
      features: [
        t("pricing-free-feature1"),
        t("pricing-free-feature2"),
        t("pricing-free-feature3"),
        t("pricing-free-feature4"),
        t("pricing-free-feature5"),
      ],
      cta: t("pricing-free-cta"),
      ctaVariant: "outline" as const,
      popular: false,
      icon: Users,
    },
    {
      id: "pro",
      name: t("pricing-pro-name"),
      tagline: t("pricing-pro-tagline"),
      price:
        billingCycle === "monthly"
          ? t("pricing-pro-price-monthly")
          : t("pricing-pro-price-yearly"),
      period:
        billingCycle === "monthly"
          ? t("pricing-period-monthly")
          : t("pricing-period-yearly"),
      description: t("pricing-pro-desc"),
      features: [
        t("pricing-pro-feature1"),
        t("pricing-pro-feature2"),
        t("pricing-pro-feature3"),
        t("pricing-pro-feature4"),
        t("pricing-pro-feature5"),
        t("pricing-pro-feature6"),
        t("pricing-pro-feature7"),
        t("pricing-pro-feature8"),
      ],
      cta: t("pricing-pro-cta"),
      ctaVariant: "default" as const,
      popular: true,
      icon: Crown,
      savings: billingCycle === "yearly" ? t("pricing-pro-savings") : null,
    },
  ];

  const handleUpgrade = (planId: string) => {
    if (planId === "free") {
      toast.info(t("pricing-already-free"));
      return;
    }

    joinWaitlist();
  };

  const benefits = [
    {
      icon: Zap,
      title: t("pricing-benefit-ai-title"),
      description: t("pricing-benefit-ai-description"),
    },
    {
      icon: TrendingUp,
      title: t("pricing-benefit-analytics-title"),
      description: t("pricing-benefit-analytics-description"),
    },
    {
      icon: Shield,
      title: t("pricing-benefit-support-title"),
      description: t("pricing-benefit-support-description"),
    },
    {
      icon: Infinity,
      title: t("pricing-benefit-unlimited-title"),
      description: t("pricing-benefit-unlimited-description"),
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 pb-24 md:pb-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">
          <Sparkles className="w-3 h-3 mr-1" />
          {t("pricing-kicker")}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold">
          {t("pricing-headline")}
          <span className="block text-primary mt-1">
            {t("pricing-headline-highlight")}
          </span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("pricing-subheadline")}
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span
          className={
            billingCycle === "monthly"
              ? "font-semibold"
              : "text-muted-foreground"
          }
        >
          {t("pricing-billing-monthly")}
        </span>
        <button
          onClick={() =>
            setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
          }
          className={`relative w-14 h-7 rounded-full transition-colors ${
            billingCycle === "yearly" ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
              billingCycle === "yearly" ? "translate-x-7" : ""
            }`}
          />
        </button>
        <span
          className={
            billingCycle === "yearly"
              ? "font-semibold"
              : "text-muted-foreground"
          }
        >
          {t("pricing-billing-yearly")}
        </span>
        {billingCycle === "yearly" && (
          <Badge variant="secondary" className="ml-2">
            {t("pricing-yearly-discount")}
          </Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? "border-2 border-primary shadow-lg shadow-primary/10"
                  : "border-2"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {t("pricing-recommended")}
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    </div>
                    <CardDescription>{plan.tagline}</CardDescription>
                  </div>
                  {isCurrent && (
                    <Badge variant="secondary">{t("pricing-current")}</Badge>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">
                      {plan.period}
                    </span>
                  </div>
                  {plan.savings && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                      {plan.savings}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.id === "pro" && isOnWaitlist ? (
                  <p className="text-sm text-success text-center">
                    {t("ai-chat-waitlist-already-joined")}
                  </p>
                ) : (
                <Button
                  className="w-full group"
                  variant={plan.ctaVariant}
                  size="lg"
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || isJoining}
                >
                  {isCurrent ? (
                    plan.cta
                  ) : isJoining ? (
                    t("ai-chat-waitlist-joining")
                  ) : (
                    <>
                      {plan.cta}
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                )}

                {plan.id === "pro" && (
                  <p className="text-xs text-center text-muted-foreground">
                    {t("pricing-pro-no-spam")}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="mt-12 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {t("pricing-why-upgrade")}
          </h2>
          <p className="text-muted-foreground">
            {t("pricing-why-upgrade-description")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t("pricing-faq-title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">{t("pricing-faq1-question")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("pricing-faq1-answer")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">{t("pricing-faq2-question")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("pricing-faq2-answer")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">{t("pricing-faq3-question")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("pricing-faq3-answer")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">{t("pricing-faq4-question")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("pricing-faq4-answer")}{" "}
              <a
                href="mailto:support@studai.app"
                className="text-primary hover:underline"
              >
                support@studai.app
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trust Notice */}
      <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        <Shield className="w-5 h-5 inline-block mr-2" />
        {t("pricing-trust-notice")}
      </div>
    </div>
  );
}
