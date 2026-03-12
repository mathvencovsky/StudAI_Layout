import { createStub } from "./base-stub";

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

export async function getEngagementMetricsStub(): Promise<EngagementMetrics> {
  return createStub<EngagementMetrics>({
    dau: 847,
    wau: 2340,
    mau: 5120,
    dauMauRatio: 16.5,
    d1Retention: 68,
    d7Retention: 42,
    d30Retention: 28,
    avgSessionsPerDay: 2.3,
    avgSessionDuration: 18,
    avgTimePerWeek: 4.2,
    aiSessionsPercent: 78,
    quizCompletionRate: 65,
    trailCompletionRate: 34,
    weeklyGrowth: 12.4,
    monthlyGrowth: 47.8,
    npsScore: 72,
  });
}

export async function getWeeklyTrendStub(): Promise<WeeklyTrend[]> {
  return createStub<WeeklyTrend[]>([
    { day: "Seg", sessions: 1240, ai: 920 },
    { day: "Ter", sessions: 1380, ai: 1050 },
    { day: "Qua", sessions: 1520, ai: 1180 },
    { day: "Qui", sessions: 1450, ai: 1100 },
    { day: "Sex", sessions: 1680, ai: 1320 },
    { day: "Sáb", sessions: 890, ai: 680 },
    { day: "Dom", sessions: 720, ai: 540 },
  ]);
}
