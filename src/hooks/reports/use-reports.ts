import { useQuery, queryOptions } from "@tanstack/react-query";
import { listStudySessions } from "@/api/study-session";
import { QUERY_KEYS } from "@/api/query-keys";

export type ReportPeriod = "week" | "month" | "quarter" | "year";

export interface ReportData {
  period: ReportPeriod;
  totalHours: number;
  consistency: number;
  evolution: number;
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

const periodDays: Record<ReportPeriod, number> = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
};

function getPeriodStart(period: ReportPeriod, referenceMs: number): number {
  return referenceMs - periodDays[period] * 86400000;
}

function buildReportData(
  sessions: Awaited<ReturnType<typeof listStudySessions>>,
  period: ReportPeriod,
): ReportData {
  const now = Date.now();
  const currentStart = getPeriodStart(period, now);
  const previousStart = getPeriodStart(period, currentStart);

  const currentSessions = sessions.filter(
    (s) => s.startedAt >= currentStart / 1000 && s.startedAt <= now / 1000,
  );
  const previousSessions = sessions.filter(
    (s) =>
      s.startedAt >= previousStart / 1000 &&
      s.startedAt < currentStart / 1000,
  );

  const totalMinutes = currentSessions.reduce(
    (sum, s) => sum + (s.durationMinutes ?? 0),
    0,
  );
  const previousMinutes = previousSessions.reduce(
    (sum, s) => sum + (s.durationMinutes ?? 0),
    0,
  );

  const activeDays = new Set(
    currentSessions.map((s) =>
      new Date(s.startedAt * 1000).toISOString().split("T")[0],
    ),
  ).size;

  const evolution =
    previousMinutes > 0
      ? Math.round(((totalMinutes - previousMinutes) / previousMinutes) * 1000) / 10
      : 0;

  const sessionMinutes = currentSessions
    .filter((s) => s.type !== "review")
    .reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
  const reviewMinutes = currentSessions
    .filter((s) => s.type === "review")
    .reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);

  const days = periodDays[period];
  const chartMap: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 86400000).toISOString().split("T")[0];
    chartMap[date] = 0;
  }
  for (const s of currentSessions) {
    const date = new Date(s.startedAt * 1000).toISOString().split("T")[0];
    if (date in chartMap) {
      chartMap[date] += s.durationMinutes ?? 0;
    }
  }

  return {
    period,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    consistency: activeDays,
    evolution,
    breakdown: {
      sessions: sessionMinutes,
      assessments: 0,
      reviews: reviewMinutes,
    },
    chartData: Object.entries(chartMap).map(([date, minutes]) => ({
      date,
      minutes,
    })),
  };
}

export const reportDataQueryOptions = (period: ReportPeriod) =>
  queryOptions({
    queryKey: [QUERY_KEYS.REPORTS, period],
    queryFn: async () => {
      const sessions = await listStudySessions();
      return buildReportData(sessions, period);
    },
    staleTime: 1000 * 60 * 5,
  });

export function useReportData(period: ReportPeriod = "week") {
  return useQuery(reportDataQueryOptions(period));
}
