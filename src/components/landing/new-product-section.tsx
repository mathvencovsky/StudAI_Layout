import { useState } from "react";
import { Brain, Calendar, RotateCcw, TrendingUp, BookOpen, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Product features section with interactive feature selector.
 */
export function NewProductSection() {
  const { t } = useTranslation();
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      icon: Brain,
      title: t("new-product-feature1-title"),
      description: t("new-product-feature1-desc"),
      detailedDescription: t("new-product-feature1-detailed"),
      stats: { label: t("new-product-feature1-stats"), active: true }
    },
    {
      icon: Calendar,
      title: t("new-product-feature2-title"),
      description: t("new-product-feature2-desc"),
      detailedDescription: t("new-product-feature2-detailed"),
      stats: { label: t("new-product-feature2-stats"), active: false }
    },
    {
      icon: RotateCcw,
      title: t("new-product-feature3-title"),
      description: t("new-product-feature3-desc"),
      detailedDescription: t("new-product-feature3-detailed"),
      stats: { label: t("new-product-feature3-stats"), active: false }
    },
    {
      icon: TrendingUp,
      title: t("new-product-feature4-title"),
      description: t("new-product-feature4-desc"),
      detailedDescription: t("new-product-feature4-detailed"),
      stats: { label: t("new-product-feature4-stats"), active: false }
    },
    {
      icon: BookOpen,
      title: t("new-product-feature5-title"),
      description: t("new-product-feature5-desc"),
      detailedDescription: t("new-product-feature5-detailed"),
      stats: { label: t("new-product-feature5-stats"), active: false }
    },
    {
      icon: Clock,
      title: t("new-product-feature6-title"),
      description: t("new-product-feature6-desc"),
      detailedDescription: t("new-product-feature6-detailed"),
      stats: { label: t("new-product-feature6-stats"), active: false }
    }
  ];

  const selectedFeatureData = features[selectedFeature];
  const SelectedIcon = selectedFeatureData.icon;

  return (
    <section id="produto" className="relative bg-background py-12 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-primary/5 border border-primary/20 rounded-full mb-10">
            <span className="text-sm font-semibold text-primary">{t("new-product-badge")}</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-foreground mb-8 leading-[1.05]">
            {t("new-product-headline1")}
            <br />
            {t("new-product-headline2")} <span className="text-primary">{t("new-product-headline3")}</span>
          </h2>
          <p className="text-2xl text-muted-foreground leading-relaxed">
            {t("new-product-subheadline")}
          </p>
        </div>

        {/* Interactive Features Layout */}
        <div className="space-y-8">
          {/* Top row: Expanded feature + side cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Expanded feature - takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-12 h-full text-primary-foreground shadow-2xl transition-all duration-500">
                <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mb-8 animate-in fade-in duration-500">
                  <SelectedIcon className="w-10 h-10 text-primary-foreground" />
                </div>
                
                <h3 className="text-4xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {selectedFeatureData.title}
                </h3>
                
                <p className="text-xl text-primary-foreground/80 leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {selectedFeatureData.detailedDescription}
                </p>

                {/* Visual indicator */}
                <div className="flex items-center gap-4 pt-6 border-t border-primary-foreground/20 animate-in fade-in duration-1000">
                  <div className="flex items-center gap-2">
                    {selectedFeatureData.stats.active && (
                      <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                    )}
                    <span className="text-sm font-medium text-primary-foreground/80">
                      {selectedFeatureData.stats.active ? t("new-product-active-now") : t("new-product-available")}
                    </span>
                  </div>
                  <div className="text-sm text-primary-foreground/60">{selectedFeatureData.stats.label}</div>
                </div>
              </div>
            </div>

            {/* Right side: feature cards stacked */}
            <div className="flex flex-col gap-4">
              {/* IA Adaptativa (index 0) */}
              {(() => {
                const feature = features[0];
                const Icon = feature.icon;
                const isSelected = selectedFeature === 0;
                
                return (
                  <button
                    onClick={() => setSelectedFeature(0)}
                    className={`w-full text-left rounded-3xl p-6 transition-all duration-300 flex-1 ${
                      isSelected
                        ? 'bg-primary/10 border-2 border-primary shadow-lg scale-105'
                        : 'bg-background border-2 border-border hover:border-primary/30 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-primary' : 'bg-primary/10'
                      }`}>
                        <Icon className={`w-6 h-6 transition-colors ${
                          isSelected ? 'text-primary-foreground' : 'text-primary'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-bold mb-1 transition-colors ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className={`text-sm leading-relaxed transition-colors ${
                          isSelected ? 'text-primary/80' : 'text-muted-foreground'
                        }`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })()}

              {/* Plano Diário (index 1) */}
              {(() => {
                const feature = features[1];
                const Icon = feature.icon;
                const isSelected = selectedFeature === 1;
                
                return (
                  <button
                    onClick={() => setSelectedFeature(1)}
                    className={`w-full text-left rounded-3xl p-6 transition-all duration-300 flex-1 ${
                      isSelected
                        ? 'bg-primary/10 border-2 border-primary shadow-lg scale-105'
                        : 'bg-background border-2 border-border hover:border-primary/30 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-primary' : 'bg-primary/10'
                      }`}>
                        <Icon className={`w-6 h-6 transition-colors ${
                          isSelected ? 'text-primary-foreground' : 'text-primary'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-bold mb-1 transition-colors ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className={`text-sm leading-relaxed transition-colors ${
                          isSelected ? 'text-primary/80' : 'text-muted-foreground'
                        }`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })()}

              {/* Calendário Inteligente (index 5) */}
              {(() => {
                const feature = features[5];
                const Icon = feature.icon;
                const isSelected = selectedFeature === 5;
                
                return (
                  <button
                    onClick={() => setSelectedFeature(5)}
                    className={`w-full text-left rounded-3xl p-6 transition-all duration-300 flex-1 ${
                      isSelected
                        ? 'bg-primary/10 border-2 border-primary shadow-lg scale-105'
                        : 'bg-background border-2 border-border hover:border-primary/30 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-primary' : 'bg-primary/10'
                      }`}>
                        <Icon className={`w-6 h-6 transition-colors ${
                          isSelected ? 'text-primary-foreground' : 'text-primary'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-bold mb-1 transition-colors ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className={`text-sm leading-relaxed transition-colors ${
                          isSelected ? 'text-primary/80' : 'text-muted-foreground'
                        }`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Bottom row: 3 cards full width */}
          <div className="grid md:grid-cols-3 gap-8">
            {[2, 3, 4].map((index) => {
              const feature = features[index];
              const Icon = feature.icon;
              const isSelected = selectedFeature === index;
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedFeature(index)}
                  className={`w-full text-left rounded-3xl p-8 transition-all duration-300 ${
                    isSelected
                      ? 'bg-primary/10 border-2 border-primary shadow-lg scale-105'
                      : 'bg-background border-2 border-border hover:border-primary/30 hover:shadow-md'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                    isSelected ? 'bg-primary' : 'bg-primary/10'
                  }`}>
                    <Icon className={`w-7 h-7 transition-colors ${
                      isSelected ? 'text-primary-foreground' : 'text-primary'
                    }`} />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-3 transition-colors ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-base leading-relaxed transition-colors ${
                    isSelected ? 'text-primary/80' : 'text-muted-foreground'
                  }`}>
                    {feature.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
