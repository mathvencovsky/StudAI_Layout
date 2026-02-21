import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { useListGoals } from "@/hooks/goal/use-list-goals";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

export function GoalsPageIntegrated() {
  const { t } = useTranslation();
  const { data: goals, isLoading, error, refetch } = useListGoals();

  const activeGoal = goals?.find((g) => g.isActive);
  const history = goals?.filter((g) => g.status === "completed") ?? [];

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return t("pages.goals.no-deadline", "Sem prazo");
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && !activeGoal && (
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
                    {activeGoal.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("pages.goals.deadline", "Prazo")}:{" "}
                    {formatDate(activeGoal.targetDate)}
                  </p>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {activeGoal.progressPercentage ?? 0}%
                </span>
              </div>
              <Progress value={activeGoal.progressPercentage ?? 0} className="h-1 mt-3" />
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    {t("pages.goals.daily-goal", "Meta diária")}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {activeGoal.minutesPerDay ?? 0} min
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    {t("pages.goals.hours-remaining", "Horas restantes")}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {activeGoal.hoursRemaining ?? 0}h
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {history.length > 0 && (
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
                      {goal.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(goal.startDate)} -{" "}
                      {formatDate(goal.targetDate)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {t(`pages.goals.status.${goal.status}`, goal.status ?? "")}
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
