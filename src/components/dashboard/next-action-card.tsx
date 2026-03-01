import { useListGoals } from "@/hooks/goal/use-list-goals";
import { useTodayTasks } from "@/hooks/daily-task/use-today-tasks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { type Goal } from "@/model/goal";
import { type DailyTask } from "@/model/daily-task";

/**
 * Gets recommendation for next action based on user's current state
 */
const getRecommendation = (
  goals: Goal[] | undefined,
  tasks: DailyTask[] | undefined,
  t: TFunction,
) => {
  const incompleteTasks = tasks?.filter((task) => !task.isCompleted) ?? [];
  if (incompleteTasks.length > 0) {
    return {
      title: t("next-action-complete-task-title"),
      description: t("next-action-complete-task-description", { count: incompleteTasks.length }),
      action: t("next-action-complete-task-action"),
      link: "/module",
    };
  }

  const activeGoal = goals?.find((goal) => goal.isActive);
  if (activeGoal && (activeGoal.progressPercentage ?? 0) < 100) {
    return {
      title: t("next-action-continue-goal-title"),
      description: activeGoal.title ?? "",
      action: t("next-action-continue-goal-action"),
      link: "/module",
    };
  }

  return {
    title: t("next-action-explore-title"),
    description: t("next-action-explore-description"),
    action: t("next-action-explore-action"),
    link: "/module",
  };
};

/**
 * Displays AI-powered next action recommendation
 */
export const NextActionCard = () => {
  const { t } = useTranslation();
  const { data: goals, isLoading: goalsLoading } = useListGoals();
  const { data: tasks, isLoading: tasksLoading } = useTodayTasks();

  const isLoading = goalsLoading || tasksLoading;

  if (isLoading) {
    return (
      <section className="border rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 overflow-hidden">
        <div className="p-4">
          <Skeleton className="h-20" />
        </div>
      </section>
    );
  }

  const recommendation = getRecommendation(goals, tasks, t);

  return (
    <section className="border rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-1">
              {t("next-action-title")}
            </h3>
            <p className="text-sm font-semibold text-foreground mb-1">
              {recommendation.title}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              {recommendation.description}
            </p>
            <Button size="sm" variant="default" asChild>
              <Link to={recommendation.link}>
                {recommendation.action}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
