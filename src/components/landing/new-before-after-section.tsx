import { useState } from "react";
import { X, Check, TrendingUp, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Before/after comparison section showing the transformation StudAI provides.
 */
export function NewBeforeAfterSection() {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<"before" | "after">("after");

  const beforeItems = [
    t("before-after-before1"),
    t("before-after-before2"),
    t("before-after-before3"),
    t("before-after-before4"),
  ];

  const afterItems = [
    t("before-after-after1"),
    t("before-after-after2"),
    t("before-after-after3"),
    t("before-after-after4"),
  ];

  const stats = [
    { value: t("before-after-stat1-value"), label: t("before-after-stat1-label") },
    { value: t("before-after-stat2-value"), label: t("before-after-stat2-label") },
    { value: t("before-after-stat3-value"), label: t("before-after-stat3-label") },
    { value: t("before-after-stat4-value"), label: t("before-after-stat4-label") },
  ];

  return (
    <section className="relative bg-background py-12 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-primary/5 border border-primary/20 rounded-full mb-10">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t("before-after-badge")}</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-foreground mb-8 leading-[1.05]">
            {t("before-after-headline1")}
            <br />
            <span className="text-primary">{t("before-after-headline2")}</span>
          </h2>
          <p className="text-2xl text-muted-foreground leading-relaxed">
            {t("before-after-subheadline")}
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-muted rounded-2xl p-2">
            <button
              onClick={() => setActiveView("before")}
              className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                activeView === "before"
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("before-after-toggle-without")}
            </button>
            <button
              onClick={() => setActiveView("after")}
              className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                activeView === "after"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("before-after-toggle-with")}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className={`transition-all duration-500 ${
            activeView === "before" ? "scale-105 opacity-100" : "scale-95 opacity-40"
          }`}>
            <div className="bg-background border-2 border-border rounded-3xl p-10 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <X className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("before-after-before-label")}</span>
                  <h3 className="text-3xl font-bold text-foreground">{t("before-after-before-title")}</h3>
                </div>
              </div>

              <div className="space-y-4">
                {beforeItems.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-muted/50 rounded-xl border border-border/50">
                    <X className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ${
            activeView === "after" ? "scale-105 opacity-100" : "scale-95 opacity-40"
          }`}>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-xl" />
              <div className="relative bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-10 h-full text-primary-foreground shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                    <Check className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wide">{t("before-after-after-label")}</span>
                    <h3 className="text-3xl font-bold text-primary-foreground">{t("before-after-after-title")}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {afterItems.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl border border-primary-foreground/20">
                      <Check className="w-6 h-6 text-primary-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-lg text-primary-foreground font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-8 w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary-foreground text-primary font-semibold rounded-xl hover:bg-primary-foreground/90 transition-all group"
                >
                  {t("before-after-cta-button")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="bg-background border-2 border-border rounded-2xl p-8 hover:border-primary hover:shadow-xl transition-all">
                <div className="text-6xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-base text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
