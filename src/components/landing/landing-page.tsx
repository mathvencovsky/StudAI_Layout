import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import {
  LandingHeader,
  LandingHero,
  LogoStrip,
  ProductSection,
  HowItWorks,
  TrustSection,
  Testimonials,
  PricingSection,
  FAQSection,
  FinalCTA,
  LandingFooter,
} from "./index";

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LogoStrip />
        <ProductSection />
        <HowItWorks />
        <TrustSection />
        <Testimonials />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
