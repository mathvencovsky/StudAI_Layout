import { useMyPlan } from "@/hooks/user-plan/use-my-plan";
import { useListGoals } from "@/hooks/goal/use-list-goals";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target, TrendingUp, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * Calculate days remaining until target date
 */
const getDaysRemaining = (targetDate?: number | null): number => {
  if (!targetDate) return 0;
  const now = Date.now();
  const diff = targetDate - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

/**
 * Calculate required minutes per day to meet goal
 */
const getRequiredMinutesPerDay = (
  hoursRemaining: number,
  daysRemaining: number
): number => {
  if (daysRemaining === 0) return 0;
  return Math.ceil((hoursRemaining * 60) / daysRemaining);
};

/**
 * Get status badge based on progress
 */
const getStatusBadge = (
  progressPercentage: number,
  daysRemaining: number
) => {
  if (progressPercentage >= 100) {
    return (
      <Badge variant="default" className="bg-green-500">
        Concluído
      </Badge>
    );
  }

  const expectedProgress = daysRemaining > 0 ? 50 : 0; // Simplified logic
  
  if (progressPercentage >= expectedProgress) {
    return (
      <Badge variant="default" className="bg-blue-500">
        No ritmo
      </Badge>
    );
  } else if (progressPercentage >= expectedProgress * 0.7) {
    return (
      <Badge variant="default" className="bg-yellow-500">
        Atenção
      </Badge>
    );
  } else {
    return (
      <Badge variant="destructive">
        Em risco
      </Badge>
    );
  }
};

/**
 * Displays active track/goal status with progress and metrics
 */
export const ActiveTrackStatusCard = () => {
  const { data: plan, isLoading: planLoading } = useMyPlan();
  const { data: goals, isLoading: goalsLoading } = useListGoals();

  const isLoading = planLoading || goalsLoading;

  if (isLoading) {
    return (
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-16" />
        </div>
      </section>
    );
  }

  const activeGoal = goals?.find((g) => g.isActive);

  if (!activeGoal && !plan) {
    return (
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium text-foreground">
            Status da trilha
          </h3>
        </div>
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Nenhuma trilha ativa
          </p>
          <Button size="sm" variant="outline">
            Explorar trilhas
          </Button>
        </div>
      </section>
    );
  }

  const daysRemaining = getDaysRemaining(activeGoal?.targetDate);
  const hoursRemaining = activeGoal?.hoursRemaining ?? 0;
  const progressPercentage = activeGoal?.progressPercentage ?? 0;
  const minutesPerDay = getRequiredMinutesPerDay(hoursRemaining, daysRemaining);

  const startDate = activeGoal?.startDate
    ? new Date(activeGoal.startDate).toLocaleDateString()
    : "-";
  const targetDate = activeGoal?.targetDate
    ? new Date(activeGoal.targetDate).toLocaleDateString()
    : "-";

  return (
    <section className="border rounded-lg bg-card overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">
            {activeGoal?.title ?? "Trilha ativa"}
          </h3>
          {getStatusBadge(progressPercentage, daysRemaining)}
        </div>
        {activeGoal?.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {activeGoal.description}
          </p>
        )}
      </div>
      <div className="p-4 space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm font-bold">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Dias restantes
              </span>
            </div>
            <p className="text-lg font-bold">{daysRemaining}</p>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Horas restantes
              </span>
            </div>
            <p className="text-lg font-bold">{hoursRemaining}h</p>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Necessário/dia
              </span>
            </div>
            <p className="text-lg font-bold">{minutesPerDay} min</p>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Horas concluídas
              </span>
            </div>
            <p className="text-lg font-bold">{plan?.completedHours ?? 0}h</p>
          </div>
        </div>

        {/* Dates */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            Início: {startDate}
          </p>
          <p>
            Meta: {targetDate}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" asChild>
            <Link to="/estudar">
              <Play className="h-4 w-4 mr-2" />
              Iniciar sessão
            </Link>
          </Button>
          <Button size="sm" variant="outline">
            Ver detalhes
          </Button>
        </div>
      </div>
    </section>
  );
};
