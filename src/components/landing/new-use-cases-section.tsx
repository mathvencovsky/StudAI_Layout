import { useState } from "react";
import { GraduationCap, Award, BookOpen, Stethoscope, Briefcase, Languages } from "lucide-react";
import { useCustomI18n as useI18n } from "@/i18n";

/**
 * Use cases section showcasing different study goals StudAI supports.
 */
export function NewUseCasesSection() {
  const { t } = useI18n();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const useCases = [
    { 
      icon: Award,
      title: t("newUseCases.case1.title"), 
      description: t("newUseCases.case1.desc"),
      stats: t("newUseCases.case1.stats")
    },
    { 
      icon: GraduationCap,
      title: t("newUseCases.case2.title"), 
      description: t("newUseCases.case2.desc"),
      stats: t("newUseCases.case2.stats")
    },
    { 
      icon: BookOpen,
      title: t("newUseCases.case3.title"), 
      description: t("newUseCases.case3.desc"),
      stats: t("newUseCases.case3.stats")
    },
    { 
      icon: Stethoscope,
      title: t("newUseCases.case4.title"), 
      description: t("newUseCases.case4.desc"),
      stats: t("newUseCases.case4.stats")
    },
    { 
      icon: Briefcase,
      title: t("newUseCases.case5.title"), 
      description: t("newUseCases.case5.desc"),
      stats: t("newUseCases.case5.stats")
    },
    { 
      icon: Languages,
      title: t("newUseCases.case6.title"), 
      description: t("newUseCases.case6.desc"),
      stats: t("newUseCases.case6.stats")
    }
  ];

  return (
    <section id="casos-de-uso" className="relative bg-background py-12 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:120px_120px]" />
      
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-32">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary rounded-full mb-12">
            <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
            <span className="text-xs font-medium text-primary-foreground uppercase tracking-widest">{t("newUseCases.badge")}</span>
          </div>
          <h2 className="text-7xl md:text-8xl font-medium text-foreground mb-10 leading-[0.9] tracking-tight">
            {t("newUseCases.headline1")}
            <br />
            <span className="text-primary">{t("newUseCases.headline2")}</span>
          </h2>
          <p className="text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-light">
            {t("newUseCases.subheadline")}
          </p>
        </div>

        {/* Use cases grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative"
              >
                <div className={`relative bg-background border-2 rounded-3xl p-10 transition-all duration-500 h-full ${
                  isHovered 
                    ? 'border-primary shadow-2xl scale-105 -translate-y-2' 
                    : 'border-border'
                }`}>
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-8 transition-all duration-500 ${
                    isHovered ? 'scale-110 rotate-6 bg-primary/90' : ''
                  }`}>
                    <Icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  
                  <h3 className={`text-3xl font-medium text-foreground mb-4 tracking-tight transition-colors duration-500 ${
                    isHovered ? 'text-foreground/80' : ''
                  }`}>
                    {useCase.title}
                  </h3>
                  <p className={`text-lg leading-relaxed mb-6 font-light transition-colors duration-500 ${
                    isHovered ? 'text-muted-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {useCase.description}
                  </p>

                  {/* Stats badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${
                    isHovered 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <span className="text-sm font-medium">{useCase.stats}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 text-center">
          <p className="text-xl text-muted-foreground mb-8 font-light">
            {t("newUseCases.bottomText")}
          </p>
          <button
            onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-4 px-12 py-6 bg-primary text-primary-foreground text-xl font-medium rounded-2xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            {t("newUseCases.ctaButton")}
            <span className="text-2xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
