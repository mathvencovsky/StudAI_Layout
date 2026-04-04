import { Brain, Zap, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * AI showcase section highlighting the platform's AI-powered features and stats.
 */
export function AIShowcaseSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-background py-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(74,159,255,0.05),transparent_70%)]" />

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-primary/5 border border-primary/20 rounded-full mb-10">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t("ai-showcase-badge")}</span>
          </div>

          <h2 className="text-6xl md:text-7xl font-bold text-foreground mb-8 leading-[1.05]">
            {t("ai-showcase-headline1")}
            <br />
            <span className="text-primary">{t("ai-showcase-headline2")}</span>
          </h2>

          <p className="text-2xl text-muted-foreground leading-relaxed">
            {t("ai-showcase-subheadline")}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="bg-background border-2 border-border rounded-3xl p-12 h-full hover:border-primary/20 hover:shadow-2xl transition-all group">
              <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Brain className="w-10 h-10 text-primary-foreground" />
              </div>

              <h3 className="text-4xl font-bold text-foreground mb-6">
                {t("ai-showcase-feature1-title")}
              </h3>

              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {t("ai-showcase-feature1-desc")}
              </p>

              <div className="bg-muted/50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/80">{t("ai-showcase-feature1-difficulty-detected")}</span>
                  <span className="text-xs px-3 py-1 bg-warning/20 text-warning-foreground rounded-full font-semibold">{t("ai-showcase-feature1-adjusting")}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">{t("ai-showcase-feature1-action1")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">{t("ai-showcase-feature1-action2")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">{t("ai-showcase-feature1-action3")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-background border-2 border-border rounded-3xl p-10 hover:border-primary/20 hover:shadow-2xl transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <Zap className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t("ai-showcase-feature2-title")}
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("ai-showcase-feature2-desc")}
              </p>
            </div>

            <div className="bg-background border-2 border-border rounded-3xl p-10 hover:border-primary/20 hover:shadow-2xl transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <TrendingUp className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t("ai-showcase-feature3-title")}
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("ai-showcase-feature3-desc")}
              </p>
            </div>
          </div>
        </div>

        {/* Dark stats bar — keep dark bg as decorative */}
        <div className="mt-20 bg-primary rounded-3xl p-12">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-background mb-3">{t("ai-showcase-stat1-value")}</div>
              <div className="text-primary-foreground/70 text-lg">{t("ai-showcase-stat1-label")}</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-background mb-3">{t("ai-showcase-stat2-value")}</div>
              <div className="text-primary-foreground/70 text-lg">{t("ai-showcase-stat2-label")}</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-background mb-3">{t("ai-showcase-stat3-value")}</div>
              <div className="text-primary-foreground/70 text-lg">{t("ai-showcase-stat3-label")}</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-background mb-3">{t("ai-showcase-stat4-value")}</div>
              <div className="text-primary-foreground/70 text-lg">{t("ai-showcase-stat4-label")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
