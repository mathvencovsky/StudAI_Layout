import { useEffect, useRef, useState } from "react";
import { UserPlus, Target, Rocket, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * How it works section with animated step-by-step guide.
 */
export function NewHowItWorks() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [rocketOffset, setRocketOffset] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const windowHeight = window.innerHeight;
      
      const triggerPoint = windowHeight * 0.3;
      
      let progress = 0;
      
      if (sectionTop < triggerPoint) {
        const scrolledPast = triggerPoint - sectionTop;
        progress = Math.max(0, Math.min(1, scrolledPast / 800));
      }
      
      setScrollProgress(progress);
      
      const offset = progress * 500;
      setRocketOffset(offset);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    { 
      icon: UserPlus,
      number: t("new-how-it-works-step1-number"),
      title: t("new-how-it-works-step1-title"), 
      description: t("new-how-it-works-step1-desc")
    },
    { 
      icon: Target,
      number: t("new-how-it-works-step2-number"),
      title: t("new-how-it-works-step2-title"), 
      description: t("new-how-it-works-step2-desc")
    },
    { 
      icon: Rocket,
      number: t("new-how-it-works-step3-number"),
      title: t("new-how-it-works-step3-title"), 
      description: t("new-how-it-works-step3-desc")
    },
    { 
      icon: TrendingUp,
      number: t("new-how-it-works-step4-number"),
      title: t("new-how-it-works-step4-title"), 
      description: t("new-how-it-works-step4-desc")
    }
  ];

  return (
    <section ref={sectionRef} id="como-funciona" className="relative bg-background py-12 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:120px_120px]" />
      
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-4xl mb-32">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary rounded-full mb-12">
            <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />
            <span className="text-xs font-medium text-primary-foreground uppercase tracking-widest">{t("new-how-it-works-badge")}</span>
          </div>
          <h2 className="text-7xl md:text-8xl font-medium text-foreground mb-10 leading-[0.9] tracking-tight">
            {t("new-how-it-works-headline1")}
            <br />
            <span className="text-primary">{t("new-how-it-works-headline2")}</span>
          </h2>
          <p className="text-2xl text-muted-foreground leading-relaxed font-light">
            {t("new-how-it-works-subheadline")}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-px bg-border" style={{ width: 'calc(100% - 160px)', left: '80px' }} />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative group">
                  <div className="absolute -top-10 -left-10 text-[12rem] font-black text-border group-hover:text-border/70 transition-all duration-700 z-0 leading-none select-none">
                    {step.number}
                  </div>
                  
                  <div className="relative z-10">
                    <div 
                      className="w-32 h-32 rounded-3xl bg-primary flex items-center justify-center mb-10 hover:bg-primary/90 transition-all duration-500 group-hover:scale-110 shadow-2xl"
                      style={
                        index === 2
                          ? { 
                              transform: `translate(${rocketOffset}px, ${-rocketOffset}px) rotate(-45deg) scale(${1 + scrollProgress * 0.15})`,
                              transition: 'transform 0.1s ease-out, background-color 0.5s',
                              opacity: Math.max(0.3, 1 - scrollProgress * 0.7),
                            }
                          : undefined
                      }
                    >
                      <Icon 
                        className="w-16 h-16 text-primary-foreground transition-all duration-500"
                        style={index === 2 ? { transform: 'rotate(45deg)' } : undefined}
                      />
                    </div>
                    
                    <h3 className="text-3xl font-medium text-foreground mb-5 group-hover:text-foreground/80 transition-colors duration-500 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light group-hover:text-muted-foreground/80 transition-colors duration-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 text-center">
          <button
            onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-4 px-12 py-6 bg-primary text-primary-foreground text-xl font-medium rounded-2xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            {t("new-how-it-works-cta-button")}
            <span className="text-2xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
