import { useMemo } from "react";
import { useSearch } from "@tanstack/react-router";
import { CheckCircle2, Sparkles, Mail } from "lucide-react";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

type ProfileKey = "concurso" | "certificacao" | "faculdade";

function isProfile(v: string | null | undefined): v is ProfileKey {
  return v === "concurso" || v === "certificacao" || v === "faculdade";
}

export function PricingSection() {
  const { t } = useI18n();
  const search = useSearch({ from: "/" });
  
  const profile = useMemo(() => {
    const p = (search as any)?.perfil;
    return isProfile(p) ? p : "concurso";
  }, [search]);

  const freeFeatures = [
    t("pricing.free.feature1"),
    t("pricing.free.feature2"),
    t("pricing.free.feature3"),
    t("pricing.free.feature4"),
    t("pricing.free.feature5"),
  ];

  const proFeatures = [
    t("pricing.pro.feature1"),
    t("pricing.pro.feature2"),
    t("pricing.pro.feature3"),
    t("pricing.pro.feature4"),
    t("pricing.pro.feature5"),
  ];

  const scrollToAuth = () => {
    const el = document.getElementById("auth-card");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      const emailInput = el.querySelector('input[type="email"]') as HTMLInputElement;
      emailInput?.focus();
    }, 150);
  };

  const waitlistMailTo = () => {
    const subject = encodeURIComponent(t("pricing.waitlistSubject"));
    const body = encodeURIComponent(
      t("pricing.waitlistBody").replace("{profile}", profile)
    );
    return `mailto:support@studi.app?subject=${subject}&body=${body}`;
  };

  return (
    <SectionWrapper id="planos" variant="plain" withNoise>
      <div className="text-center mb-8">
        <KickerBadge className="mb-3">{t("pricing.kicker")}</KickerBadge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          {t("pricing.headline")}
          <HeadlineHighlight>{t("pricing.headlineHighlight")}</HeadlineHighlight>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
          {t("pricing.subheadline")}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-stretch">
        <Card className="border-2 shadow-lg">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">
                  {t("pricing.free.name")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("pricing.free.tagline")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-foreground">
                  {t("pricing.free.price")}
                </p>
                <p className="text-xs font-bold text-muted-foreground">
                  {t("pricing.free.forever")}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {t("pricing.free.desc")}
            </p>

            <ul className="mt-4 space-y-2">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Button
                onClick={scrollToAuth}
                className="w-full font-extrabold bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
              >
                {t("pricing.free.cta")}
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground font-semibold">
              {t("pricing.trustNotice")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg relative overflow-hidden">
          <div className="absolute -top-3 right-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold bg-primary/15 text-primary border-2 border-primary/30">
              <Sparkles className="h-3.5 w-3.5" />
              {t("pricing.recommended")}
            </span>
          </div>

          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">
                  {t("pricing.pro.name")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("pricing.pro.tagline")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-extrabold text-foreground">
                  {t("pricing.pro.price")}
                </p>
                <p className="text-xs font-bold text-muted-foreground">
                  {t("pricing.comingSoon")}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {t("pricing.pro.desc")}
            </p>

            <ul className="mt-4 space-y-2">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Button
                asChild
                className="w-full font-extrabold bg-gradient-to-r from-primary to-accent shadow-lg"
              >
                <a href={waitlistMailTo()}>
                  <Mail className="h-4 w-4 mr-2" />
                  {t("pricing.pro.cta")}
                </a>
              </Button>
              <p className="mt-2 text-xs text-muted-foreground font-semibold">
                {t("pricing.pro.noSpam")}
              </p>
            </div>

            <div className="mt-6 border-t-2 pt-4">
              <p className="text-xs font-extrabold text-foreground">
                {t("pricing.questions")}
              </p>
              <a
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                href="mailto:support@studi.app"
              >
                support@studi.app
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
