import { LandingHeader } from "./landing-header";
import { NewLandingHero } from "./NewLandingHero";
import { AIShowcaseSection } from "./AIShowcaseSection";
import { NewProblemSection } from "./NewProblemSection";
import { NewBeforeAfterSection } from "./NewBeforeAfterSection";
import { NewProductSection } from "./NewProductSection";
import { NewHowItWorks } from "./NewHowItWorks";
import { NewUseCasesSection } from "./NewUseCasesSection";
import { NewTestimonials } from "./NewTestimonials";
import { NewPricingSection } from "./NewPricingSection";
import { NewTransparencySection } from "./NewTransparencySection";
import { NewFAQSection } from "./NewFAQSection";
import { NewFooter } from "./NewFooter";
import { AuthCard } from "./auth-card";
import { useCustomI18n as useI18n } from "@/i18n";

export function LandingPage() {
  const { t } = useI18n();
  
  return (
    <div className="min-h-screen bg-white relative">
      <LandingHeader />
      <main className="relative bg-white">
        {/* Hero - MASSIVE impact */}
        <NewLandingHero />
        
        {/* AI Showcase - Show the tech */}
        <AIShowcaseSection />
        
        {/* Problem - Why this matters */}
        <NewProblemSection />
        
        {/* Before/After - Show the transformation */}
        <NewBeforeAfterSection />
        
        {/* Core Product - O que fazemos */}
        <NewProductSection />
        
        {/* How It Works - Como funciona */}
        <NewHowItWorks />
        
        {/* Use Cases - Para quem é */}
        <NewUseCasesSection />
        
        {/* Social Proof */}
        <NewTestimonials />
        
        {/* Pricing */}
        <NewPricingSection />
        
        {/* CTA Final com Auth */}
        <section id="auth-section" className="relative bg-white py-20">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />
          
          <div className="relative w-full max-w-6xl mx-auto px-6 md:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="mb-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-8">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-blue-700">{t("finalCta.badge")}</span>
                </div>
                <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  {t("finalCta.headline1")} <span className="text-blue-600">{t("finalCta.headline2")}</span>
                </h2>
                <p className="text-2xl text-gray-600">
                  {t("finalCta.subheadline")}
                </p>
              </div>
              <AuthCard />
            </div>
          </div>
        </section>
        
        {/* Transparency & FAQ no final */}
        <NewTransparencySection />
        <NewFAQSection />
      </main>
      <NewFooter />
    </div>
  );
}