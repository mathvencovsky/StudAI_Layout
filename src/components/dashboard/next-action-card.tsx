import { useListStudySessions } from "@/hooks/study-session/use-list-sessions";
import { useListGoals } from "@/hooks/goal/use-list-goals";
import { useTodayTasks } from "@/hooks/daily-task/use-today-tasks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * Simple AI recommendation logic based on user data
 */
const getRecommendation = (
  sessions: any[] | undefined,
  goals: any[] | undefined,
  tasks: any[] | undefined
) => {
  // Check if there are incomplete tasks today
  const incompleteTasks = tasks?.filter((t) => !t.isCompleted) ?? [];
  if (incompleteTasks.length > 0) {
    return {
      title: "Complete sua próxima tarefa",
      description: `Você tem ${incompleteTasks.length} tarefa(s) pendente(s) hoje`,
      action: "Iniciar tarefa",
      link: "/estudar",
    };
  }

  // Check if user has an active goal
  const activeGoal = goals?.find((g) => g.isActive);
  if (activeGoal && (activeGoal.progressPercentage ?? 0) < 100) {
    return {
      title: "Continue seu objetivo",
      description: activeGoal.title ?? "Mantenha o ritmo!",
      action: "Estudar com IA",
      link: "/estudar",
    };
  }

  // Check if user hasn't studied recently
  const recentSessions = sessions?.filter((s) => {
    const sessionDate = s.startedAt ? new Date(s.startedAt).getTime() : 0;
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return sessionDate > oneDayAgo;
  });

  if (!recentSessions || recentSessions.length === 0) {
    return {
      title: "Hora de estudar!",
      description: "Você não estudou nas últimas 24 horas",
      action: "Iniciar sessão",
      link: "/estudar",
    };
  }

  // Default recommendation
  return {
    title: "Explore novos conteúdos",
    description: "Descubra novas trilhas e módulos",
    action: "Explorar",
    link: "/content",
  };
};

/**
 * Displays AI-powered next action recommendation
 */
export const NextActionCard = () => {
  const { data: sessions, isLoading: sessionsLoading } = useListStudySessions();
  const { data: goals, isLoading: goalsLoading } = useListGoals();
  const { data: tasks, isLoading: tasksLoading } = useTodayTasks();

  const isLoading = sessionsLoading || goalsLoading || tasksLoading;

  if (isLoading) {
    return (
      <section className="border rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 overflow-hidden">
        <div className="p-4">
          <Skeleton className="h-20" />
        </div>
      </section>
    );
  }

  const recommendation = getRecommendation(sessions, goals, tasks);

  return (
    <section className="border rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-1">
              Próxima melhor ação
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
