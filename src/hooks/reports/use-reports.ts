import { useQuery, queryOptions } from "@tanstack/react-query";
import { listStudySessions } from "@/api/study-session";
import { listAllUserContentProgressWithContent } from "@/api/user-content-progress";
import { type UserContentProgressWithContent } from "@/model/user-content-progress";
import { QUERY_KEYS } from "@/api/query-keys";
import { type Schema } from "../../../amplify/data/resource";

export type ReportPeriod = "week" | "month" | "year";

export interface ReportData {
  period: ReportPeriod;
  contentHours: number;
  contentActiveDays: number;
  contentEvolution: number;
  contentBreakdown: {
    videos: number;
    articles: number;
    quizzes: number;
    other: number;
  };
  contentChartData: { date: string; minutes: number }[];
  activeTimeHours: number;
  activeTimeSessions: number;
  activeTimeEvolution: number;
  activeTimeChartData: { date: string; minutes: number }[];
}

const periodSeconds: Record<ReportPeriod, number> = {
  week: 7 * 86400,
  month: 30 * 86400,
  year: 365 * 86400,
};

const dateFromSeconds = (s: number) =>
  new Date(s * 1000).toISOString().split("T")[0];

function buildChartMap(period: ReportPeriod, nowSeconds: number): Record<string, number> {
  const days = periodSeconds[period] / 86400;
  const map: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const date = dateFromSeconds(nowSeconds - i * 86400);
    map[date] = 0;
  }
  return map;
}

function buildReportData(
  sessions: Schema["StudySession"]["type"][],
  contentProgress: UserContentProgressWithContent[],
  period: ReportPeriod,
): ReportData {
  const now = Math.floor(Date.now() / 1000);
  const duration = periodSeconds[period];
  const currentStart = now - duration;
  const previousStart = currentStart - duration;

  // --- Content metrics ---
  const currentContent = contentProgress.filter(
    (p) =>
      p.isCompleted &&
      p.completionDate != null &&
      p.completionDate >= currentStart &&
      p.completionDate <= now,
  );
  const previousContent = contentProgress.filter(
    (p) =>
      p.isCompleted &&
      p.completionDate != null &&
      p.completionDate >= previousStart &&
      p.completionDate < currentStart,
  );

  const contentMinutes = currentContent.reduce(
    (sum, p) => sum + Math.floor((p.content?.durationInSeconds ?? 0) / 60),
    0,
  );
  const previousContentMinutes = previousContent.reduce(
    (sum, p) => sum + Math.floor((p.content?.durationInSeconds ?? 0) / 60),
    0,
  );

  const contentActiveDays = new Set(
    currentContent
      .filter((p) => p.completionDate != null)
      .map((p) => dateFromSeconds(p.completionDate!)),
  ).size;

  const contentEvolution =
    previousContentMinutes > 0
      ? Math.round(((contentMinutes - previousContentMinutes) / previousContentMinutes) * 1000) / 10
      : 0;

  const contentChartMap = buildChartMap(period, now);
  for (const p of currentContent) {
    if (p.completionDate == null) continue;
    const date = dateFromSeconds(p.completionDate);
    if (date in contentChartMap) {
      contentChartMap[date] += Math.floor((p.content?.durationInSeconds ?? 0) / 60);
    }
  }

  const contentBreakdown = { videos: 0, articles: 0, quizzes: 0, other: 0 };
  for (const p of currentContent) {
    const minutes = Math.floor((p.content?.durationInSeconds ?? 0) / 60);
    const type = p.content?.type;
    if (type === "youtube_video") contentBreakdown.videos += minutes;
    else if (type === "article") contentBreakdown.articles += minutes;
    else if (type === "quiz") contentBreakdown.quizzes += minutes;
    else contentBreakdown.other += minutes;
  }

  // --- Active time metrics ---
  const currentSessions = sessions.filter(
    (s) => s.startedAt >= currentStart && s.startedAt <= now,
  );
  const previousSessions = sessions.filter(
    (s) => s.startedAt >= previousStart && s.startedAt < currentStart,
  );

  const activeMinutes = currentSessions.reduce(
    (sum, s) => sum + (s.durationMinutes ?? 0),
    0,
  );
  const previousActiveMinutes = previousSessions.reduce(
    (sum, s) => sum + (s.durationMinutes ?? 0),
    0,
  );

  const activeTimeEvolution =
    previousActiveMinutes > 0
      ? Math.round(((activeMinutes - previousActiveMinutes) / previousActiveMinutes) * 1000) / 10
      : 0;

  const activeTimeChartMap = buildChartMap(period, now);
  for (const s of currentSessions) {
    const date = dateFromSeconds(s.startedAt);
    if (date in activeTimeChartMap) {
      activeTimeChartMap[date] += s.durationMinutes ?? 0;
    }
  }

  return {
    period,
    contentHours: Math.round((contentMinutes / 60) * 10) / 10,
    contentActiveDays,
    contentEvolution,
    contentBreakdown,
    contentChartData: Object.entries(contentChartMap).map(([date, minutes]) => ({ date, minutes })),
    activeTimeHours: Math.round((activeMinutes / 60) * 10) / 10,
    activeTimeSessions: currentSessions.length,
    activeTimeEvolution,
    activeTimeChartData: Object.entries(activeTimeChartMap).map(([date, minutes]) => ({ date, minutes })),
  };
}

export const reportDataQueryOptions = (period: ReportPeriod) =>
  queryOptions({
    queryKey: [QUERY_KEYS.REPORTS, period],
    queryFn: async () => {
      const [sessions, contentProgress] = await Promise.all([
        listStudySessions(),
        listAllUserContentProgressWithContent(),
      ]);
      return buildReportData(sessions, contentProgress, period);
    },
    staleTime: 1000 * 60 * 5,
  });

export function useReportData(period: ReportPeriod = "week") {
  return useQuery(reportDataQueryOptions(period));
}
