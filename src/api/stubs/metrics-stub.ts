import { createStub } from "./base-stub";

export interface MetricsData {
  averageSessionTime: number; // em minutos
  timeDistribution: {
    type: string;
    minutes: number;
    percentage: number;
  }[];
  assessmentPerformance: {
    average: number;
    trend: "up" | "down" | "stable";
  };
  performanceOverTime: {
    date: string;
    score: number;
  }[];
}

export async function getMetricsDataStub(
  _period: string = "month",
): Promise<MetricsData> {
  const performanceData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    performanceData.push({
      date: date.toISOString().split("t")[0],
      score: Math.floor(Math.random() * 30) + 70,
    });
  }

  return createStub({
    averageSessionTime: 52,
    timeDistribution: [
      { type: "Estudo", minutes: 180, percentage: 60 },
      { type: "Avaliações", minutes: 75, percentage: 25 },
      { type: "Revisões", minutes: 45, percentage: 15 },
    ],
    assessmentPerformance: {
      average: 82.5,
      trend: "up" as const,
    },
    performanceOverTime: performanceData,
  });
}
