import { useMemo } from "react";
import { useSearch } from "@tanstack/react-router";
import { UserPlus, Settings2, TrendingUp, Rocket } from "lucide-react";
import { type ProfileKey, isValidProfile, getStoredProfile } from "./landing-hero";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";
import { useTranslation } from "react-i18next";

export function HowItWorks() {
  const { t } = useTranslation();
  const searchParams = useSearch({ from: "/" }) as { perfil?: ProfileKey; redirect?: string };

  const currentProfile = useMemo((): ProfileKey => {
    const urlProfile = searchParams?.perfil;
    if (isValidProfile(urlProfile ?? null)) return urlProfile!;
    return getStoredProfile();
  }, [searchParams]);

  const baseSteps = [
    {
      icon: UserPlus,
      number: "01",
      title: t("how-it-works-step1-title"),
      description: t("how-it-works-step1-desc"),
    },
    {
      icon: Settings2,
      number: "02",
      title: t("how-it-works-step2-title"),
      description: t("how-it-works-step2-desc"),
    },
    {
      icon: TrendingUp,
      number: "03",
      title: t("how-it-works-step3-title"),
      description: t("how-it-works-step3-desc"),
    },
  ];

  const profileExamples: Record<ProfileKey, { examples: string[]; promises: string[] }> = {
    concurso: {
      examples: [
        t("how-it-works-concurso-example1"),
        t("how-it-works-concurso-example2"),
        t("how-it-works-concurso-example3"),
      ],
      promises: [
        t("how-it-works-concurso-promise1"),
        t("how-it-works-concurso-promise2"),
        t("how-it-works-concurso-promise3"),
      ],
    },
    certificacao: {
      examples: [
        t("how-it-works-certificacao-example1"),
        t("how-it-works-certificacao-example2"),
        t("how-it-works-certificacao-example3"),
      ],
      promises: [
        t("how-it-works-certificacao-promise1"),
        t("how-it-works-certificacao-promise2"),
        t("how-it-works-certificacao-promise3"),
      ],
    },
    faculdade: {
      examples: [
        t("how-it-works-faculdade-example1"),
        t("how-it-works-faculdade-example2"),
        t("how-it-works-faculdade-example3"),
      ],
      promises: [
        t("how-it-works-faculdade-promise1"),
        t("how-it-works-faculdade-promise2"),
        t("how-it-works-faculdade-promise3"),
      ],
    },
  };

  const steps = useMemo(() => {
    const profileData = profileExamples[currentProfile];
    return baseSteps.map((step, index) => ({
      ...step,
      example: profileData.examples[index],
      promise: profileData.promises[index],
    }));
  }, [currentProfile, t]);

  return (
    <SectionWrapper id="como-funciona" variant="tint" tabIndex={-1} withNoise>
      <div className="text-center mb-8">
        <KickerBadge variant="warm" className="mb-3">
          <Rocket className="h-3.5 w-3.5" />
          {t("how-it-works-kicker")}
        </KickerBadge>
        <h2 className="display-h2 text-foreground">
          {t("how-it-works-headline")}
          <HeadlineHighlight>{t("how-it-works-headline-highlight")}</HeadlineHighlight>
        </h2>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm">{t("how-it-works-subheadline")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/40 to-transparent" />
            )}

            <div className="text-center">
              <div className="relative inline-flex">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mx-auto border-2 border-primary/20 shadow-lg">
                  <step.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <span className="absolute top-1 right-1 w-8 h-8 rounded-full bg-gradient-to-br from-accent-warm to-accent-warm/80 text-accent-warm-foreground text-xs font-bold flex items-center justify-center shadow-lg">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-4 text-base sm:text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                {step.description}
              </p>
              <p className="mt-2 text-xs bg-card text-muted-foreground px-3 py-1.5 rounded-full inline-block border-2 font-medium">
                {step.example}
              </p>
              <p className="mt-1.5 text-xs text-success font-bold">{step.promise}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
