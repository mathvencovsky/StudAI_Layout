import { useCustomI18n } from "@/i18n";
import { Sparkles, Target, Zap, BookOpen, BarChart3, Users2 } from "lucide-react";

export function FeaturesSection() {
  const { t } = useCustomI18n();

  const features = [
    {
      icon: Sparkles,
      title: t("features.ai.title") || "AI-Powered Learning",
      description: t("features.ai.description") || "Personalized study paths that adapt to your learning style and pace",
    },
    {
      icon: Target,
      title: t("features.goals.title") || "Goal Tracking",
      description: t("features.goals.description") || "Set clear objectives and track your progress with detailed analytics",
    },
    {
      icon: Zap,
      title: t("features.speed.title") || "Learn Faster",
      description: t("features.speed.description") || "Spaced repetition and active recall techniques for better retention",
    },
    {
      icon: BookOpen,
      title: t("features.content.title") || "Rich Content",
      description: t("features.content.description") || "Access thousands of curated study materials and resources",
    },
    {
      icon: BarChart3,
      title: t("features.analytics.title") || "Advanced Analytics",
      description: t("features.analytics.description") || "Detailed insights into your learning patterns and performance",
    },
    {
      icon: Users2,
      title: t("features.community.title") || "Study Community",
      description: t("features.community.description") || "Connect with fellow learners and share knowledge",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
            {t("features.title") || "Everything you need to"}
            {" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("features.titleHighlight") || "succeed"}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("features.subtitle") || "All the tools and features you need to achieve your learning goals"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-background border border-border hover:border-primary/20 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
