import { useMemo } from "react";
import { useListStudySessions } from "@/hooks/study-session/use-list-sessions";
import { useListQuizAttempts } from "@/hooks/quiz/use-list-quiz-attempts";
import { useListLoginDays } from "@/hooks/user/use-login-days";
import { calculateStreak } from "@/utils/calculate-streak";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DAY_MS = 86400000;

interface MetricsData {
  studyTime: {
    total: number;
    thisMonth: number;
  };
  streak: {
    current: number;
    longest: number;
  };
  completions: {
    total: number;
    courses: number;
    modules: number;
  };
  weeklyActivity: {
    day: string;
    minutes: number;
  }[];
  monthlyStats: {
    activeDays: number;
  };
  progressByCategory: {
    name: string;
    progress: number;
  }[];
  achievements: {
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }[];
}

/**
 * Returns metrics computed from real StudySession, QuizAttempt, and UserProfile data.
 */
export function useMetrics() {
  const { data: sessions = [], isLoading: sessionsLoading, error: sessionsError, refetch } = useListStudySessions();
  const { data: quizAttempts = [], isLoading: quizLoading } = useListQuizAttempts();
  const { data: loginDays = [], isLoading: loginDaysLoading } = useListLoginDays();

  const data = useMemo((): MetricsData => {
    const now = Date.now();
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000;

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
    const thisMonthMinutes = sessions
      .filter((s) => s.startedAt >= monthStart)
      .reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);

    const streak = calculateStreak(loginDays);

    const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now - (6 - i) * DAY_MS);
      const dayStartS = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000;
      const dayEndS = dayStartS + 86400;
      const daySessions = sessions.filter((s) => s.startedAt >= dayStartS && s.startedAt < dayEndS);
      return {
        day: DAY_LABELS[date.getDay()],
        minutes: daySessions.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0),
      };
    });

    const monthSessions = sessions.filter((s) => s.startedAt >= monthStart);
    const activeDaySet = new Set(
      monthSessions.map((s) => {
        const d = new Date(s.startedAt * 1000);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      }),
    );
    const activeDays = activeDaySet.size;

    const totalHours = Math.round(totalMinutes / 60);
    const totalSessions = sessions.length;
    const passedQuizzes = quizAttempts.filter((a) => a.passed).length;

    const achievements = [
      {
        name: "Primeira Sessão",
        description: "Complete sua primeira sessão de estudo",
        icon: "🎯",
        unlocked: totalSessions >= 1,
      },
      {
        name: "Sequência de 7 dias",
        description: "Estude por 7 dias consecutivos",
        icon: "🔥",
        unlocked: streak.current >= 7,
      },
      {
        name: "100 Horas",
        description: "Acumule 100 horas de estudo",
        icon: "⏰",
        unlocked: totalHours >= 100,
      },
      {
        name: "Mestre do Quiz",
        description: "Complete 50 quizzes",
        icon: "🧠",
        unlocked: passedQuizzes >= 50,
      },
      {
        name: "Sequência de 30 dias",
        description: "Estude por 30 dias consecutivos",
        icon: "💪",
        unlocked: streak.current >= 30,
      },
      {
        name: "500 Horas",
        description: "Acumule 500 horas de estudo",
        icon: "🏆",
        unlocked: totalHours >= 500,
      },
    ];

    return {
      studyTime: {
        total: totalHours,
        thisMonth: Math.round(thisMonthMinutes / 60),
      },
      streak: {
        current: streak.current,
        longest: streak.longest,
      },
      completions: {
        total: quizAttempts.length,
        courses: 0,
        modules: 0,
      },
      weeklyActivity,
      monthlyStats: {
        activeDays,
      },
      progressByCategory: [],
      achievements,
    };
  }, [sessions, quizAttempts, loginDays]);

  const isLoading = sessionsLoading || quizLoading || loginDaysLoading;
  const error = sessionsError;

  return { data, isLoading, error, refetch };
}
