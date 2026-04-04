import { useTranslation } from "react-i18next";
import { Brain, Target, TrendingUp, Users } from "lucide-react";

export function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Brain,
      value: "10x",
      label: t("stats-faster") || "Faster Learning",
      description: t("stats-faster-desc") || "AI-powered study paths",
    },
    {
      icon: Target,
      value: "95%",
      label: t("stats-success") || "Success Rate",
      description: t("stats-success-desc") || "Students reaching goals",
    },
    {
      icon: TrendingUp,
      value: "3x",
      label: t("stats-retention") || "Better Retention",
      description: t("stats-retention-desc") || "Spaced repetition system",
    },
    {
      icon: Users,
      value: "50k+",
      label: t("stats-students") || "Active Students",
      description: t("stats-students-desc") || "Learning every day",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container relative">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            {t("stats-title") || "The Power of"}
            {" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("stats-title-highlight") || "AI-Driven Learning"}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("stats-subtitle") || "Real results from students who transformed their study routine with StudAI"}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center space-y-4 group"
              >
                <div className="inline-flex w-14 h-14 rounded-2xl bg-primary/5 items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-5xl md:text-6xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
