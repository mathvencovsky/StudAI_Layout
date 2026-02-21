import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Clock, TrendingUp, BookOpen, Brain } from "lucide-react";
import { useListGoals } from "@/hooks/goal/use-list-goals";
import { useUpdateGoal } from "@/hooks/goal/use-update-goal";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function MeuObjetivoPage() {
  const { t } = useTranslation();
  const { data: goals, isLoading, error, refetch } = useListGoals();
  const updateGoal = useUpdateGoal();
  const [changingActive, setChangingActive] = useState(false);

  const activeGoal = goals?.find((g) => g.isActive);
  const otherGoals = goals?.filter((g) => !g.isActive) || [];

  const handleSetActive = async (goalId: string) => {
    if (changingActive) return;
    
    setChangingActive(true);
    try {
      // Desativar objetivo atual
      if (activeGoal) {
        await updateGoal.mutateAsync({
          id: activeGoal.id,
          isActive: false,
        });
      }
      
      // Ativar novo objetivo
      await updateGoal.mutateAsync({
        id: goalId,
        isActive: true,
      });
      
      toast.success(t("pages-goal-changed"));
    } catch (error) {
      toast.error(t("pages-goal-change-error"));
    } finally {
      setChangingActive(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track": return "bg-green-500";
      case "attention": return "bg-yellow-500";
      case "at_risk": return "bg-red-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "on_track": return t("pages-goal-on-track");
      case "attention": return t("pages-goal-attention");
      case "at_risk": return t("pages-goal-at-risk");
      case "completed": return t("pages-goal-completed");
      case "paused": return t("pages-goal-paused");
      case "cancelled": return t("pages-goal-cancelled");
      default: return status;
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("pages-goal-title")}</h1>
          <p className="text-muted-foreground">{t("pages-goal-description")}</p>
        </div>
        <Link to="/track-create">
          <Button>
            <Target className="mr-2 h-4 w-4" />
            {t("pages-goal-new-goal")}
          </Button>
        </Link>
      </div>

      {activeGoal && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">{activeGoal.title}</CardTitle>
                <CardDescription>{activeGoal.description}</CardDescription>
              </div>
              <Badge className={getStatusColor(activeGoal.status || "active")}>
                {getStatusLabel(activeGoal.status || "active")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t("pages-goal-progress")}</span>
                <span className="text-sm text-muted-foreground">
                  {activeGoal.progressPercentage}%
                </span>
              </div>
              <Progress value={activeGoal.progressPercentage} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("pages-goal-hours-remaining")}</p>
                  <p className="text-lg font-semibold">{activeGoal.hoursRemaining}h</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("pages-goal-min-per-day")}</p>
                  <p className="text-lg font-semibold">{activeGoal.minutesPerDay} min</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("pages-goal-target-date")}</p>
                  <p className="text-lg font-semibold">
                    {activeGoal.targetDate ? new Date(activeGoal.targetDate).toLocaleDateString("pt-BR") : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/estudar" className="flex-1">
                <Button className="w-full" size="lg">
                  <Brain className="mr-2 h-5 w-5" />
                  {t("pages-goal-study-ai")}
                </Button>
              </Link>
              <Link to="/trilha" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  <BookOpen className="mr-2 h-5 w-5" />
                  {t("pages-goal-view-track")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {!activeGoal && (
        <EmptyState
          title={t("pages-goal-no-active")}
          description={t("pages-goal-no-active-description")}
          icon={Target}
        />
      )}

      {otherGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("pages-goal-other-goals")}</h2>
          <div className="grid gap-4">
            {otherGoals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{goal.title}</CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(goal.status || "active")}>
                      {getStatusLabel(goal.status || "active")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{goal.progressPercentage}% {t("pages-goal-completed")}</span>
                      <span>•</span>
                      <span>{goal.hoursRemaining}h {t("pages-goal-remaining")}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetActive(goal.id)}
                      disabled={changingActive}
                    >
                      {t("pages-goal-make-active")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
