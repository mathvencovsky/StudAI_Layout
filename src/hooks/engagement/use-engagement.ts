import { useMemo } from "react";
import { useListStudySessions } from "@/hooks/study-session/use-list-sessions";
import { useListQuizAttempts } from "@/hooks/quiz/use-list-quiz-attempts";

export interface EngagementMetrics {
  dau: number;
  wau: number;
  mau: number;
  dauMauRatio: number;
  d1Retention: number;
  d7Retention: number;
  d30Retention: number;
  avgSessionsPerDay: number;
  avgSessionDuration: number;
  avgTimePerWeek: number;
  aiSessionsPercent: number;
  quizCompletionRate: number;
  trailCompletionRate: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  npsScore: number;
}

export interface WeeklyTrend {
  day: string;
  sessions: number;
  ai: number;
}

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DAY_S = 86400;
const WEEK_S = 7 * DAY_S;

/**
 * Returns engagement metrics computed from the current user's study sessions and quiz attempts.
 * Cross-user metrics (DAU, MAU, retention, NPS) are not available and default to 0.
 */
export function useEngagementMetrics() {
  const { data: sessions = [], isLoading, error, refetch } = useListStudySessions();
  const { data: quizAttempts = [] } = useListQuizAttempts();

  const data = useMemo((): EngagementMetrics => {
    const nowS = Date.now() / 1000;

    const last30 = sessions.filter((s) => s.startedAt >= nowS - 30 * DAY_S);
    const avgSessionsPerDay = parseFloat((last30.length / 30).toFixed(1));

    const withDuration = sessions.filter((s) => (s.durationMinutes ?? 0) > 0);
    const avgSessionDuration =
      withDuration.length > 0
        ? Math.round(
            withDuration.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0) /
              withDuration.length,
          )
        : 0;

    const last4Weeks = sessions.filter((s) => s.startedAt >= nowS - 28 * DAY_S);
    const totalMinutes4Weeks = last4Weeks.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
    const avgTimePerWeek = parseFloat((totalMinutes4Weeks / 4 / 60).toFixed(1));

    const aiSessionsPercent =
      sessions.length > 0
        ? Math.round((sessions.filter((s) => s.type === "ai_session").length / sessions.length) * 100)
        : 0;

    const quizCompletionRate =
      quizAttempts.length > 0
        ? Math.round((quizAttempts.filter((a) => a.passed).length / quizAttempts.length) * 100)
        : 0;

    const thisWeekCount = sessions.filter((s) => s.startedAt >= nowS - WEEK_S).length;
    const lastWeekCount = sessions.filter(
      (s) => s.startedAt >= nowS - 2 * WEEK_S && s.startedAt < nowS - WEEK_S,
    ).length;
    const weeklyGrowth =
      lastWeekCount > 0
        ? parseFloat((((thisWeekCount - lastWeekCount) / lastWeekCount) * 100).toFixed(1))
        : 0;

    return {
      dau: 0,
      wau: 0,
      mau: 0,
      dauMauRatio: 0,
      d1Retention: 0,
      d7Retention: 0,
      d30Retention: 0,
      avgSessionsPerDay,
      avgSessionDuration,
      avgTimePerWeek,
      aiSessionsPercent,
      quizCompletionRate,
      trailCompletionRate: 0,
      weeklyGrowth,
      monthlyGrowth: 0,
      npsScore: 0,
    };
  }, [sessions, quizAttempts]);

  return { data, isLoading, error, refetch };
}

/**
 * Returns session counts per day for the last 7 days.
 */
export function useWeeklyTrend() {
  const { data: sessions = [], isLoading } = useListStudySessions();

  const data = useMemo((): WeeklyTrend[] => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      const dayStartS = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000;
      const dayEndS = dayStartS + DAY_S;

      const daySessions = sessions.filter((s) => s.startedAt >= dayStartS && s.startedAt < dayEndS);
      return {
        day: DAY_LABELS[date.getDay()],
        sessions: daySessions.length,
        ai: daySessions.filter((s) => s.type === "ai_session").length,
      };
    });
  }, [sessions]);

  return { data, isLoading };
}
