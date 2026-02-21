import { useMemo } from "react";
import { useMyProfile } from "@/hooks/user-profile/use-my-profile";
import { useListStudySessions } from "@/hooks/study-session/use-list-sessions";
import { useListDailyTasks } from "@/hooks/daily-task/use-list-daily-tasks";

interface DashboardMetrics {
  currentStreak: number;
  weeklyMinutes: number;
  xp: number;
  level: number;
}

interface RecentSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  topic: string;
  xpEarned: number;
  type: "study" | "review" | "assessment";
}

interface UpcomingTask {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentSessions: RecentSession[];
  upcomingTasks: UpcomingTask[];
}

/**
 * Composes dashboard data from real Amplify hooks.
 */
export function useDashboardData() {
  const { data: profile, isLoading: isLoadingProfile } = useMyProfile();
  const { data: sessions, isLoading: isLoadingSessions } = useListStudySessions();
  const { data: tasks, isLoading: isLoadingTasks } = useListDailyTasks();

  const isLoading = isLoadingProfile || isLoadingSessions || isLoadingTasks;

  const data = useMemo((): DashboardData | undefined => {
    if (isLoading) return undefined;

    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const weeklyMinutes = (sessions ?? [])
      .filter((s) => s.startedAt != null && s.startedAt * 1000 >= weekAgo)
      .reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);

    const recentSessions = (sessions ?? [])
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        startTime: new Date((s.startedAt ?? 0) * 1000).toISOString(),
        endTime: s.endedAt != null ? new Date(s.endedAt * 1000).toISOString() : undefined,
        duration: s.durationMinutes ?? 0,
        topic: s.notes ?? s.type ?? "",
        xpEarned: s.xpEarned ?? 0,
        type: (s.type === "review" ? "review" : s.type === "quiz" ? "assessment" : "study") as "study" | "review" | "assessment",
      }));

    const upcomingTasks = (tasks ?? [])
      .filter((t) => !t.isCompleted)
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        title: t.taskType ?? "",
        dueDate: t.date,
        priority: "medium" as const,
      }));

    return {
      metrics: {
        currentStreak: profile?.streak ?? 0,
        weeklyMinutes,
        xp: profile?.xp ?? 0,
        level: profile?.level ?? 1,
      },
      recentSessions,
      upcomingTasks,
    };
  }, [isLoading, profile, sessions, tasks]);

  return { data, isLoading };
}
