import { LandingHeader } from "./landing-header";
import { NewLandingHero } from "./new-landing-hero";
import { AIShowcaseSection } from "./ai-showcase-section";
import { NewProblemSection } from "./new-problem-section";
import { NewBeforeAfterSection } from "./new-before-after-section";
import { NewProductSection } from "./new-product-section";
import { NewHowItWorks } from "./new-how-it-works";
import { NewUseCasesSection } from "./new-use-cases-section";
import { NewTestimonials } from "./new-testimonials";
import { NewPricingSection } from "./new-pricing-section";
import { NewTransparencySection } from "./new-transparency-section";
import { NewFAQSection } from "./new-faq-section";
import { NewFooter } from "./new-footer";
import { AuthCard } from "./auth-card";
import { useTranslation } from "react-i18next";

/**
 * Main landing page component that composes all landing sections.
 */
export function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background relative">
      <LandingHeader />
      <main className="relative bg-background">
        <NewLandingHero />
        <AIShowcaseSection />
        <NewProblemSection />
        <NewBeforeAfterSection />
        <NewProductSection />
        <NewHowItWorks />
        <NewUseCasesSection />
        <NewTestimonials />
        <NewPricingSection />

        <section id="auth-section" className="relative bg-background py-12">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />

          <div className="relative w-full max-w-6xl mx-auto px-6 md:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="mb-20 text-center">
                <h2 className="text-6xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
                  {t("final-cta-headline")} <span className="text-primary">{t("final-cta-headline-highlight")}</span>
                </h2>
                <p className="text-2xl text-muted-foreground">
                  {t("final-cta-subheadline")}
                </p>
              </div>
              <AuthCard className="mx-auto" />
            </div>
          </div>
        </section>

        <NewTransparencySection />
        <NewFAQSection />
      </main>
      <NewFooter />
    </div>
  );
}
