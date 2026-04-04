import { useState } from "react";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Pricing section with free and pro plan cards.
 */
export function NewPricingSection() {
  const { t } = useTranslation();
  const [hoveredPlan, setHoveredPlan] = useState<'free' | 'pro' | null>(null);

  const freeFeatures = [
    t("new-pricing-free-feature1"),
    t("new-pricing-free-feature2"),
    t("new-pricing-free-feature3"),
    t("new-pricing-free-feature4"),
    t("new-pricing-free-feature5")
  ];

  const proFeatures = [
    t("new-pricing-pro-feature1"),
    t("new-pricing-pro-feature2"),
    t("new-pricing-pro-feature3"),
    t("new-pricing-pro-feature4"),
    t("new-pricing-pro-feature5"),
    t("new-pricing-pro-feature6")
  ];

  return (
    <section id="planos" className="relative bg-background py-12">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-primary/5 border border-primary/20 rounded-full mb-10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t("new-pricing-badge")}</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-foreground mb-8 leading-[1.05]">
            {t("new-pricing-headline1")}
            <br />
            <span className="text-primary">{t("new-pricing-headline2")}</span>
          </h2>
          <p className="text-2xl text-muted-foreground">
            {t("new-pricing-subheadline")}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Free Plan */}
          <div
            onMouseEnter={() => setHoveredPlan('free')}
            onMouseLeave={() => setHoveredPlan(null)}
            className="relative group h-full"
          >
            {/* Spacer for alignment with Pro card badge */}
            <div className="h-10 mb-5" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity" />
            
            <div className={`relative bg-background border-2 rounded-3xl p-12 transition-all duration-300 h-full flex flex-col ${
              hoveredPlan === 'free'
                ? 'border-primary shadow-2xl scale-105'
                : 'border-border hover:border-primary/30'
            }`}>
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                <Zap className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>

              <div className="mb-10">
                <h3 className="text-3xl font-bold text-foreground mb-4">{t("new-pricing-free-title")}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-7xl font-bold text-foreground">
                    {t("new-pricing-free-price")}
                  </span>
                  <span className="text-2xl text-muted-foreground">{t("new-pricing-free-per-month")}</span>
                </div>
                <p className="text-xl text-muted-foreground">{t("new-pricing-free-desc")}</p>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                {freeFeatures.map((feature, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary transition-colors">
                      <Check className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <span className="text-lg text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <div>
                <button
                  onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  {t("new-pricing-free-cta")}
                </button>

                {/* Popular badge */}
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-semibold">
                    <span>⭐</span> {t("new-pricing-free-popular")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Plan — keep dark/purple decorative styling as-is */}
          <div
            onMouseEnter={() => setHoveredPlan('pro')}
            onMouseLeave={() => setHoveredPlan(null)}
            className="relative group h-full"
          >
            {/* Coming soon badge */}
            <div className="h-10 mb-5 flex items-center justify-center">
              <div className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                {t("new-pricing-pro-coming-soon")}
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity" />
            
            <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 rounded-3xl p-12 transition-all duration-300 h-full flex flex-col ${
              hoveredPlan === 'pro'
                ? 'border-purple-500 shadow-2xl scale-105'
                : 'border-gray-700'
            }`}>
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Crown className="w-8 h-8 text-white" />
              </div>

              <div className="mb-10">
                <h3 className="text-3xl font-bold text-white mb-4">{t("new-pricing-pro-title")}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {t("new-pricing-pro-price")}
                  </span>
                </div>
                <p className="text-xl text-gray-400">{t("new-pricing-pro-desc")}</p>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                {proFeatures.map((feature, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all">
                      <Check className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-lg text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div>
                <button
                  disabled
                  className="w-full py-5 bg-gradient-to-r from-gray-800 to-gray-700 text-gray-500 text-lg font-semibold rounded-xl cursor-not-allowed"
                >
                  {t("new-pricing-pro-cta")}
                </button>

                {/* Notify badge */}
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 rounded-full text-sm font-semibold">
                    <span>🔔</span> {t("new-pricing-pro-notify")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom guarantee */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-success/10 border border-success/30 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <span className="text-xl">✓</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-foreground">{t("new-pricing-guarantee-title")}</p>
              <p className="text-sm text-muted-foreground">{t("new-pricing-guarantee-desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
