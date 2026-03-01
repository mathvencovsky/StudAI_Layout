import { useTodayTasks } from "@/hooks/daily-task/use-today-tasks";
import { useUpdateDailyTask } from "@/hooks/daily-task/use-update-daily-task";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Code, Brain, FileText, Play } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const TASK_ICONS = {
  reading: BookOpen,
  practice: Code,
  quiz: Brain,
  summary: FileText,
};

/**
 * Displays today's daily plan with tasks
 */
export const DailyPlanCard = () => {
  const { t } = useTranslation();
  const { data: tasks, isLoading } = useTodayTasks();
  const { mutate: updateTask } = useUpdateDailyTask();

  const handleToggleTask = (taskId: string, currentStatus: boolean) => {
    updateTask(
      { id: taskId, isCompleted: !currentStatus },
      {
        onSuccess: () => {
          toast.success(
            !currentStatus
              ? t("daily-plan-task-completed")
              : t("daily-plan-task-unchecked")
          );
        },
        onError: () => {
          toast.error(t("daily-plan-task-error"));
        },
      }
    );
  };

  if (isLoading) {
    return (
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </section>
    );
  }

  const completedCount = tasks?.filter((t) => t.isCompleted).length ?? 0;
  const totalCount = tasks?.length ?? 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <section className="border rounded-lg bg-card overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">
              {t("daily-plan-title")}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("daily-plan-tasks-completed", { completed: completedCount, total: totalCount })}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground">{Math.round(progress)}%</span>
          </div>
        </div>
        <Progress value={progress} className="h-2 mt-3" />
      </div>
      <div className="p-4">
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-3">
              {t("daily-plan-no-tasks")}
            </p>
            <Button size="sm" variant="outline" asChild>
              <Link to="/study">
                <Play className="h-4 w-4 mr-2" />
                {t("daily-plan-start-session")}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => {
              const Icon = TASK_ICONS[task.taskType ?? "reading"];
              const taskLabels = {
                reading: t("daily-plan-task-reading"),
                practice: t("daily-plan-task-practice"),
                quiz: t("daily-plan-task-quiz"),
                summary: t("daily-plan-task-summary"),
              };
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={task.isCompleted ?? false}
                    onCheckedChange={() =>
                      handleToggleTask(task.id, task.isCompleted ?? false)
                    }
                  />
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        task.isCompleted ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {taskLabels[task.taskType ?? "reading"]}
                    </p>
                    {task.durationMinutes && (
                      <p className="text-xs text-muted-foreground">
                        {task.durationMinutes} min
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
