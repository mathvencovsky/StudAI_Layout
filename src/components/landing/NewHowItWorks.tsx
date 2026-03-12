import { useEffect, useRef, useState } from "react";
import { UserPlus, Target, Rocket, TrendingUp } from "lucide-react";
import { useCustomI18n as useI18n } from "@/i18n";

export function NewHowItWorks() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [rocketOffset, setRocketOffset] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const windowHeight = window.innerHeight;
      
      // Rocket starts flying when section top reaches top 30% of viewport
      // This means the cards are fully visible and centered
      const triggerPoint = windowHeight * 0.3;
      
      let progress = 0;
      
      // Start animation when section top passes the trigger point
      if (sectionTop < triggerPoint) {
        // Calculate how much we've scrolled past the trigger
        const scrolledPast = triggerPoint - sectionTop;
        // Normalize to 0-1 range over 800px of scroll
        progress = Math.max(0, Math.min(1, scrolledPast / 800));
      }
      
      setScrollProgress(progress);
      
      // Rocket flies diagonally (up and to the right) like a missile
      // Maximum movement: 500px up and 500px right
      const offset = progress * 500;
      setRocketOffset(offset);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    { 
      icon: UserPlus,
      number: t("newHowItWorks.step1.number"),
      title: t("newHowItWorks.step1.title"), 
      description: t("newHowItWorks.step1.desc")
    },
    { 
      icon: Target,
      number: t("newHowItWorks.step2.number"),
      title: t("newHowItWorks.step2.title"), 
      description: t("newHowItWorks.step2.desc")
    },
    { 
      icon: Rocket,
      number: t("newHowItWorks.step3.number"),
      title: t("newHowItWorks.step3.title"), 
      description: t("newHowItWorks.step3.desc")
    },
    { 
      icon: TrendingUp,
      number: t("newHowItWorks.step4.number"),
      title: t("newHowItWorks.step4.title"), 
      description: t("newHowItWorks.step4.desc")
    }
  ];

  return (
    <section ref={sectionRef} id="como-funciona" className="relative bg-white py-12 overflow-hidden">
      {/* Background - Subtle and clean */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:120px_120px]" />
      
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header - Clean and bold */}
        <div className="max-w-4xl mb-32">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 rounded-full mb-12">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-medium text-white uppercase tracking-widest">{t("newHowItWorks.badge")}</span>
          </div>
          <h2 className="text-7xl md:text-8xl font-medium text-gray-900 mb-10 leading-[0.9] tracking-tight">
            {t("newHowItWorks.headline1")}
            <br />
            <span className="text-blue-600">{t("newHowItWorks.headline2")}</span>
          </h2>
          <p className="text-2xl text-gray-600 leading-relaxed font-light">
            {t("newHowItWorks.subheadline")}
          </p>
        </div>

        {/* Steps - Clean cards with strong hierarchy */}
        <div className="relative">
          {/* Connection line - Clean */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-px bg-gray-200" style={{ width: 'calc(100% - 160px)', left: '80px' }} />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative group">
                  {/* Number badge - Strong presence */}
                  <div className="absolute -top-10 -left-10 text-[12rem] font-black text-gray-100 group-hover:text-gray-200 transition-all duration-700 z-0 leading-none select-none">
                    {step.number}
                  </div>
                  
                  <div className="relative z-10">
                    {/* Icon - Bold and clean */}
                    <div 
                      className="w-32 h-32 rounded-3xl bg-blue-600 flex items-center justify-center mb-10 hover:bg-blue-700 transition-all duration-500 group-hover:scale-110 shadow-2xl"
                      style={
                        index === 2 // Rocket step
                          ? { 
                              transform: `translate(${rocketOffset}px, ${-rocketOffset}px) rotate(-45deg) scale(${1 + scrollProgress * 0.15})`,
                              transition: 'transform 0.1s ease-out, background-color 0.5s',
                              opacity: Math.max(0.3, 1 - scrollProgress * 0.7),
                              backgroundColor: scrollProgress > 0.3 ? '#2563eb' : undefined
                            }
                          : undefined
                      }
                    >
                      <Icon 
                        className="w-16 h-16 text-white transition-all duration-500"
                        style={index === 2 ? { transform: 'rotate(45deg)' } : undefined}
                      />
                    </div>
                    
                    {/* Content - Strong typography */}
                    <h3 className="text-3xl font-medium text-gray-900 mb-5 group-hover:text-gray-700 transition-colors duration-500 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-500 leading-relaxed font-light group-hover:text-gray-700 transition-colors duration-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA - Bold and clear */}
        <div className="mt-32 text-center">
          <button
            onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-4 px-12 py-6 bg-blue-600 text-white text-xl font-medium rounded-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            {t("newHowItWorks.ctaButton")}
            <span className="text-2xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
