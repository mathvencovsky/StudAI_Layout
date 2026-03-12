import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { useActiveGoal } from "@/hooks/goals/use-active-goal";
import { useGoalHistory } from "@/hooks/goals/use-goal-history";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

export function MetasPageIntegrated() {
  const { t } = useTranslation();
  const {
    data: activeGoal,
    isLoading: activeLoading,
    error: activeError,
    refetch: refetchActive,
  } = useActiveGoal();
  const {
    data: history,
    isLoading: historyLoading,
  } = useGoalHistory();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateProgress = (goal: any) => {
    if (!goal.endDate) return 0;
    const total = goal.minutesPerWeek;
    const current = goal.progress.currentWeekMinutes;
    return Math.min(Math.round((current / total) * 100), 100);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-foreground">
            {t("pages.goals.title", "Metas")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("pages.goals.description", "Objetivos de estudo.")}
          </p>
        </div>
        <Button size="sm" variant="outline" className="h-8 text-xs">
          <Plus size={14} className="mr-1" />
          {t("pages.goals.new", "Nova")}
        </Button>
      </div>

      {/* Active Goal */}
      {activeLoading && <LoadingState />}
      {activeError && <ErrorState error={activeError} onRetry={refetchActive} />}
      {!activeLoading && !activeError && !activeGoal && (
        <EmptyState
          title={t("pages.goals.no-active", "Nenhuma meta ativa")}
          description={t(
            "pages.goals.no-active-description",
            "Crie uma meta para começar a acompanhar seu progresso"
          )}
          icon={Target}
          action={{
            label: t("pages.goals.create", "Criar meta"),
            onClick: () => console.log("Create goal"),
          }}
        />
      )}

      {activeGoal && (
        <div className="space-y-4">
          <section className="border rounded-lg bg-card overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    {t("pages.goals.active-goal", "Meta Ativa")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("pages.goals.deadline", "Prazo")}:{" "}
                    {activeGoal.endDate
                      ? formatDate(activeGoal.endDate)
                      : t("pages.goals.no-deadline", "Sem prazo")}
                  </p>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {calculateProgress(activeGoal)}%
                </span>
              </div>
              <Progress value={calculateProgress(activeGoal)} className="h-1 mt-3" />
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    {t("pages.goals.daily-goal", "Meta diária")}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {activeGoal.minutesPerDay} min
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    {t("pages.goals.weekly-goal", "Meta semanal")}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {activeGoal.minutesPerWeek} min
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    {t("pages.goals.today", "Hoje")}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {activeGoal.progress.todayMinutes} min
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    {t("pages.goals.this-week", "Esta semana")}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {activeGoal.progress.currentWeekMinutes} min
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* History */}
      {!historyLoading && history && history.length > 0 && (
        <section className="border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium text-foreground">
              {t("pages.goals.history", "Histórico")}
            </h2>
          </div>
          <div className="divide-y">
            {history.map((goal) => (
              <div key={goal.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {goal.minutesPerDay} min/dia · {goal.minutesPerWeek} min/semana
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(goal.startDate)} -{" "}
                      {goal.endDate ? formatDate(goal.endDate) : "Presente"}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {t(`pages.goals.status.${goal.status}`, goal.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
