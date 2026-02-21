import { createStub } from "./base-stub";

export type ReportPeriod = "week" | "month" | "quarter" | "year";

export interface ReportData {
  period: ReportPeriod;
  totalHours: number;
  consistency: number; // dias consecutivos
  evolution: number; // % comparado com período anterior
  breakdown: {
    sessions: number;
    assessments: number;
    reviews: number;
  };
  chartData: {
    date: string;
    minutes: number;
  }[];
}

export async function getReportDataStub(
  period: ReportPeriod = "week",
): Promise<ReportData> {
  const generateChartData = (days: number) => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      data.push({
        date: date.toISOString().split("t")[0],
        minutes: Math.floor(Math.random() * 120) + 30,
      });
    }
    return data;
  };

  const periodDays = {
    week: 7,
    month: 30,
    quarter: 90,
    year: 365,
  };

  const chartData = generateChartData(periodDays[period]);
  const totalMinutes = chartData.reduce((sum, d) => sum + d.minutes, 0);

  return createStub({
    period,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    consistency: 7,
    evolution: 15.5,
    breakdown: {
      sessions: Math.round(totalMinutes * 0.6),
      assessments: Math.round(totalMinutes * 0.25),
      reviews: Math.round(totalMinutes * 0.15),
    },
    chartData,
  });
}
