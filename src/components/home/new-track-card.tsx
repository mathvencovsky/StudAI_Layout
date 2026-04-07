import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles, ChevronRight, BookOpen, Trophy, Briefcase, GraduationCap, Sprout, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_GOALS = [
  { id: "job_prep",        icon: Trophy,        color: "text-yellow-500 bg-yellow-500/10", labelKey: "goal-concurso-cert" },
  { id: "career_change",   icon: Briefcase,     color: "text-blue-500 bg-blue-500/10",    labelKey: "goal-career-change" },
  { id: "upskilling",      icon: Sparkles,      color: "text-purple-500 bg-purple-500/10", labelKey: "goal-upskilling" },
  { id: "academic",        icon: GraduationCap, color: "text-green-500 bg-green-500/10",  labelKey: "goal-academic" },
  { id: "beginner",        icon: Sprout,        color: "text-teal-500 bg-teal-500/10",    labelKey: "goal-beginner" },
  { id: "personal_project",icon: Rocket,        color: "text-orange-500 bg-orange-500/10", labelKey: "goal-personal-project" },
] as const;

/**
 * Interactive card on the home page that lets the student start a new
 * learning path by quickly picking a goal, then going to the full questionnaire.
 */
export function NewTrackCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleGoalClick = (goalId: string) => {
    // Navigate to learning preferences with the goal pre-selected via search param
    void navigate({ to: "/learning-preferences", search: { goal: goalId } as any });
  };

  const handleFullQuestionnaire = () => {
    void navigate({ to: "/learning-preferences" });
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 overflow-hidden hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {t("new-track-card-title" as any, "Começar uma nova trilha")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("new-track-card-desc" as any, "Qual é o seu objetivo agora?")}
            </p>
          </div>
        </div>
      </div>

      {/* Quick goal picker */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {QUICK_GOALS.map(({ id, icon: Icon, color, labelKey }) => (
            <button
              key={id}
              onClick={() => handleGoalClick(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all",
                hovered === id
                  ? "border-primary bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                  : "border-border bg-background hover:border-primary/40"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors",
                hovered === id ? "bg-primary-foreground/20" : color
              )}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className={cn(
                "text-xs font-medium leading-tight line-clamp-2",
                hovered === id ? "text-primary-foreground" : "text-foreground/80"
              )}>
                {t(labelKey as any, labelKey)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Full questionnaire link */}
      <button
        onClick={handleFullQuestionnaire}
        className="w-full flex items-center justify-between px-4 py-3 border-t border-primary/10 hover:bg-primary/5 transition-colors group"
      >
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          {t("new-track-card-full" as any, "Responder o questionário completo")}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
      </button>
    </div>
  );
}
