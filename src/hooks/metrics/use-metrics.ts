import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/api/query-keys";

// Mock data structure for metrics
interface MetricsData {
  studyTime: {
    total: number;
    thisMonth: number;
    monthlyGoal: number;
  };
  streak: {
    current: number;
    longest: number;
  };
  xp: {
    total: number;
    level: number;
    xpPerLevel: number;
    xpToNextLevel: number;
  };
  completions: {
    total: number;
    courses: number;
    modules: number;
  };
  weeklyActivity: {
    day: string;
    minutes: number;
    xp: number;
  }[];
  monthlyStats: {
    activeDays: number;
    dailyGoalRate: number;
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

async function getMetricsStub(): Promise<MetricsData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const today = new Date();
  
  return {
    studyTime: {
      total: 245,
      thisMonth: 42,
      monthlyGoal: 60,
    },
    streak: {
      current: 7,
      longest: 15,
    },
    xp: {
      total: 3450,
      level: 12,
      xpPerLevel: 500,
      xpToNextLevel: 50,
    },
    completions: {
      total: 28,
      courses: 3,
      modules: 25,
    },
    weeklyActivity: Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        day: weekDays[date.getDay()],
        minutes: Math.floor(Math.random() * 90) + 30,
        xp: Math.floor(Math.random() * 100) + 50,
      };
    }),
    monthlyStats: {
      activeDays: 22,
      dailyGoalRate: 85,
    },
    progressByCategory: [
      { name: "JavaScript", progress: 75 },
      { name: "React", progress: 60 },
      { name: "TypeScript", progress: 45 },
      { name: "Node.js", progress: 30 },
    ],
    achievements: [
      {
        name: "Primeira Sessão",
        description: "Complete sua primeira sessão de estudo",
        icon: "🎯",
        unlocked: true,
      },
      {
        name: "Sequência de 7 dias",
        description: "Estude por 7 dias consecutivos",
        icon: "🔥",
        unlocked: true,
      },
      {
        name: "100 Horas",
        description: "Acumule 100 horas de estudo",
        icon: "⏰",
        unlocked: true,
      },
      {
        name: "Mestre do Quiz",
        description: "Complete 50 quizzes",
        icon: "🧠",
        unlocked: false,
      },
      {
        name: "Sequência de 30 dias",
        description: "Estude por 30 dias consecutivos",
        icon: "💪",
        unlocked: false,
      },
      {
        name: "500 Horas",
        description: "Acumule 500 horas de estudo",
        icon: "🏆",
        unlocked: false,
      },
    ],
  };
}

export function useMetrics() {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS],
    queryFn: getMetricsStub,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
