import { useState } from "react";
import { Shield, Database, Lock, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCustomI18n as useI18n } from "@/i18n";

/**
 * Transparency section explaining data privacy and security principles.
 */
export function NewTransparencySection() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState(0);

  const principles = [
    {
      icon: Database,
      title: t("transparency.principle1.title"),
      description: t("transparency.principle1.desc"),
      details: [
        t("transparency.principle1.detail1"),
        t("transparency.principle1.detail2"),
        t("transparency.principle1.detail3"),
        t("transparency.principle1.detail4"),
      ],
    },
    {
      icon: Shield,
      title: t("transparency.principle2.title"),
      description: t("transparency.principle2.desc"),
      details: [
        t("transparency.principle2.detail1"),
        t("transparency.principle2.detail2"),
        t("transparency.principle2.detail3"),
        t("transparency.principle2.detail4"),
      ],
    },
    {
      icon: Lock,
      title: t("transparency.principle3.title"),
      description: t("transparency.principle3.desc"),
      details: [
        t("transparency.principle3.detail1"),
        t("transparency.principle3.detail2"),
        t("transparency.principle3.detail3"),
        t("transparency.principle3.detail4"),
      ],
    },
    {
      icon: Download,
      title: t("transparency.principle4.title"),
      description: t("transparency.principle4.desc"),
      details: [
        t("transparency.principle4.detail1"),
        t("transparency.principle4.detail2"),
        t("transparency.principle4.detail3"),
        t("transparency.principle4.detail4"),
      ],
    },
  ];

  const activePrinciple = principles[activeTab];
  const ActiveIcon = activePrinciple.icon;

  return (
    <section id="transparencia" className="relative bg-background py-12">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-primary/5 border border-primary/20 rounded-full mb-10">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t("transparency.badge")}</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-foreground mb-8 leading-[1.05]">
            {t("transparency.headline1")}
            <br />
            <span className="text-primary">{t("transparency.headline2")}</span>
          </h2>
          <p className="text-2xl text-muted-foreground leading-relaxed">
            {t("transparency.subheadline")}
          </p>
        </div>

        <div className="mb-16 p-10 bg-primary/5 border-2 border-primary/20 rounded-3xl max-w-4xl">
          <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xl">⚡</span>
            </div>
            {t("transparency.summaryTitle")}
          </h3>
          <ul className="space-y-5 text-foreground/80">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-lg">✓</span>
              </div>
              <span className="text-lg">{t("transparency.summary1")}</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-lg">✓</span>
              </div>
              <span className="text-lg">{t("transparency.summary2")}</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-lg">✓</span>
              </div>
              <span className="text-lg">{t("transparency.summary3")}</span>
            </li>
          </ul>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="space-y-4">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              const isActive = activeTab === index;

              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`w-full text-left rounded-2xl p-6 transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xl scale-105"
                      : "bg-background border-2 border-border hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? "bg-primary-foreground/20" : "bg-primary/10"
                    }`}>
                      <Icon className={`w-6 h-6 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <span className={`font-bold text-lg ${isActive ? "text-primary-foreground" : "text-foreground"}`}>
                      {principle.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-background border-2 border-border rounded-3xl p-10 h-full">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                <ActiveIcon className="w-10 h-10 text-primary" />
              </div>

              <h3 className="text-3xl font-bold text-foreground mb-6">
                {activePrinciple.title}
              </h3>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {activePrinciple.description}
              </p>

              <div className="space-y-4">
                {activePrinciple.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span className="text-foreground/80">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 justify-center pt-12 border-t border-border">
          {[
            { to: "/privacy", label: t("transparency.linkPrivacy") },
            { to: "/security", label: t("transparency.linkSecurity") },
            { to: "/terms", label: t("transparency.linkTerms") },
            { to: "/support", label: t("transparency.linkSupport") },
          ].map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors font-medium text-lg group"
            >
              {link.label}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
