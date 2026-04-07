import { useMemo } from "react";
import { CheckCircle2, Circle, ChevronRight, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useMyLearningPreference } from "@/hooks/learning-preference/use-my-learning-preference";
import { useLastStartedModuleWithContents } from "@/hooks/modules/use-last-started-module-with-contents";
import { useListLoginDays } from "@/hooks/user/use-login-days";
import { calculateStreak } from "@/utils/calculate-streak";
import { cn } from "@/lib/utils";
import { useState } from "react";

const STORAGE_KEY = "studai:onboarding-dismissed";

interface Step {
  id: string;
  label: string;
  done: boolean;
  action?: string;
  to?: string;
}

/**
 * Onboarding checklist — shows until all steps are done or user dismisses.
 * Inspired by Notion's "Getting started" checklist.
 */
export function OnboardingChecklist() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  });

  const { data: preference } = useMyLearningPreference();
  const { data: lastModule } = useLastStartedModuleWithContents();
  const { data: loginDays = [] } = useListLoginDays();
  const { current: streak } = useMemo(() => calculateStreak(loginDays), [loginDays]);

  const steps: Step[] = [
    {
      id: "account",
      label: "Criar sua conta",
      done: true, // always true if they're here
    },
    {
      id: "preferences",
      label: "Definir suas preferências de aprendizado",
      done: !!preference,
      to: "/learning-preferences",
      action: "Configurar",
    },
    {
      id: "track",
      label: "Iniciar sua primeira trilha",
      done: !!lastModule,
      to: "/track",
      action: "Explorar trilhas",
    },
    {
      id: "module",
      label: "Completar seu primeiro módulo",
      done: (lastModule?.completedCount ?? 0) > 0,
      to: lastModule ? `/module/${lastModule.module.id}` : "/module",
      action: "Continuar estudando",
    },
    {
      id: "streak",
      label: "Manter 3 dias seguidos de estudo",
      done: streak >= 3,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;
  const progress = Math.round((completedCount / steps.length) * 100);

  // Auto-dismiss when all done
  if (allDone || dismissed) return null;

  const handleDismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setDismissed(true);
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            {steps.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "h-1.5 w-5 rounded-full transition-colors",
                  s.done ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-foreground">
            Primeiros passos
          </p>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{steps.length}
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Steps */}
      <div className="divide-y">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              step.done ? "opacity-60" : ""
            )}
          >
            {step.done ? (
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            <span className={cn(
              "text-sm flex-1",
              step.done ? "line-through text-muted-foreground" : "text-foreground"
            )}>
              {step.label}
            </span>
            {!step.done && step.to && (
              <button
                onClick={() => void navigate({ to: step.to! })}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
              >
                {step.action}
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
