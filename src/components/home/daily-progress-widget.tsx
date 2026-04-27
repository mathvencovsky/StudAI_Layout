import { useMemo } from "react";
import { Flame, Target, Zap, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useListLoginDays } from "@/hooks/user/use-login-days";
import { useListStudySessions } from "@/hooks/study-session/use-list-sessions";
import { useMyLearningPreference } from "@/hooks/learning-preference/use-my-learning-preference";
import { useAiSessionUsage } from "@/hooks/subscription/use-entitlements";
import { calculateStreak } from "@/utils/calculate-streak";
import { cn } from "@/lib/utils";

/**
 * Compact daily progress widget — streak, today's study time vs goal.
 * Inspired by Duolingo's habit loop: always visible, always motivating.
 */
export function DailyProgressWidget() {
  const { data: loginDays = [] } = useListLoginDays();
  const { data: sessions = [] } = useListStudySessions();
  const { data: preference } = useMyLearningPreference();
  const aiUsage = useAiSessionUsage();

  const { current: streak } = useMemo(() => calculateStreak(loginDays), [loginDays]);

  const todayMinutes = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStartSec = Math.floor(todayStart.getTime() / 1000);
    return sessions
      .filter((s) => s.startedAt != null && s.startedAt >= todayStartSec)
      .reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
  }, [sessions]);

  const goalMinutes = preference?.minutesPerDay ?? 30;
  const progress = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));
  const goalReached = todayMinutes >= goalMinutes;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Streak card */}
      <div className={cn(
        "rounded-xl border p-3 flex items-center gap-3",
        streak > 0 ? "border-orange-500/30 bg-orange-500/5" : "border-border bg-card"
      )}>
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          streak > 0 ? "bg-orange-500/15" : "bg-muted"
        )}>
          <Flame className={cn("h-5 w-5", streak > 0 ? "text-orange-500" : "text-muted-foreground")} />
        </div>
        <div className="min-w-0">
          <p className="text-xl font-bold leading-none">{streak}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {streak === 1 ? "dia seguido" : "dias seguidos"}
          </p>
          {streak === 0 && (
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">Estude hoje para começar!</p>
          )}
        </div>
      </div>

      {/* Daily goal card */}
      <div className={cn(
        "rounded-xl border p-3",
        goalReached ? "border-green-500/30 bg-green-500/5" : "border-border bg-card"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <div className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
            goalReached ? "bg-green-500/15" : "bg-muted"
          )}>
            {goalReached
              ? <Zap className="h-3.5 w-3.5 text-green-500" />
              : <Target className="h-3.5 w-3.5 text-muted-foreground" />
            }
          </div>
          <p className="text-xs font-medium text-foreground">
            {goalReached ? "Meta atingida! 🎉" : "Meta diária"}
          </p>
        </div>
        <Progress value={progress} className={cn("h-1.5 mb-1.5", goalReached && "[&>div]:bg-green-500")} />
        <p className="text-[10px] text-muted-foreground">
          {todayMinutes} / {goalMinutes} min
        </p>
      </div>

      {/* AI session usage card — only shown for Free users */}
      {!aiUsage.isLoading && !aiUsage.unlimited && (
        <div className={cn(
          "col-span-2 rounded-xl border p-3",
          aiUsage.remaining === 0
            ? "border-destructive/30 bg-destructive/5"
            : "border-border bg-card"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn(
              "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
              aiUsage.remaining === 0 ? "bg-destructive/15" : "bg-primary/10"
            )}>
              <Sparkles className={cn("h-3.5 w-3.5", aiUsage.remaining === 0 ? "text-destructive" : "text-primary")} />
            </div>
            <p className="text-xs font-medium text-foreground">AI Study Sessions</p>
            <span className="ml-auto text-xs text-muted-foreground">
              {aiUsage.remaining} / {aiUsage.limit} remaining today
            </span>
          </div>
          <Progress
            value={aiUsage.limit ? Math.round((aiUsage.used / aiUsage.limit) * 100) : 0}
            className={cn("h-1.5", aiUsage.remaining === 0 && "[&>div]:bg-destructive")}
          />
          {aiUsage.remaining === 0 && (
            <p className="text-[10px] text-destructive mt-1">
              Daily limit reached. Resets at midnight UTC.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
