import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useReportData } from "@/hooks/reports/use-reports";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";
import type { ReportPeriod } from "@/hooks/reports/use-reports";

/** Groups daily chart data into weekly buckets for the year view */
function groupIntoWeeks(
  data: { date: string; minutes: number }[],
): { date: string; minutes: number }[] {
  const weeks: { date: string; minutes: number }[] = [];
  for (let i = 0; i < data.length; i += 7) {
    const slice = data.slice(i, i + 7);
    weeks.push({
      date: slice[0].date,
      minutes: slice.reduce((sum, d) => sum + d.minutes, 0),
    });
  }
  return weeks;
}

interface ActivityChartProps {
  data: { date: string; minutes: number }[];
  period: ReportPeriod;
}

function ActivityChart({ data, period }: ActivityChartProps) {
  const chartData = period === "year" ? groupIntoWeeks(data) : data;
  const maxMinutes = Math.max(...chartData.map((d) => d.minutes), 1);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex justify-between gap-1 flex-wrap">
      {chartData.map((item, index) => {
        const intensity = item.minutes / maxMinutes;
        const label =
          period === "week"
            ? weekDays[new Date(item.date).getDay()]
            : period === "month"
              ? new Date(item.date).getDate().toString()
              : `W${index + 1}`;
        return (
          <div key={index} className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <div
              className="w-full rounded"
              style={{
                height: "24px",
                backgroundColor: `hsl(var(--primary) / ${Math.max(intensity * 0.8, 0.1)})`,
              }}
            />
            {period !== "year" && (
              <p className="text-[9px] text-muted-foreground truncate w-full text-center">
                {label}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ReportsPageIntegrated() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<ReportPeriod>("week");
  const { data: reportData, isLoading, error, refetch } = useReportData(period);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  if (!reportData) return null;

  const { contentBreakdown } = reportData;
  const breakdownTotal =
    contentBreakdown.videos +
    contentBreakdown.articles +
    contentBreakdown.quizzes +
    contentBreakdown.other;
  const breakdownPercent = (value: number) =>
    breakdownTotal > 0 ? Math.round((value / breakdownTotal) * 100) : 0;

  const avgContentPerDay =
    reportData.contentActiveDays > 0
      ? Math.round((reportData.contentHours / reportData.contentActiveDays) * 10) / 10
      : 0;

  const avgSessionMinutes =
    reportData.activeTimeSessions > 0
      ? Math.round((reportData.activeTimeHours * 60) / reportData.activeTimeSessions)
      : 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages-reports-title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages-reports-description")}
        </p>
      </div>

      <Tabs
        value={period}
        onValueChange={(v) => setPeriod(v as ReportPeriod)}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">{t("pages-reports-week")}</TabsTrigger>
          <TabsTrigger value="month">{t("pages-reports-month")}</TabsTrigger>
          <TabsTrigger value="year">{t("pages-reports-year")}</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-6">
          {/* Content Hours Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              {t("pages-reports-content-hours-title")}
            </h2>

            <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {reportData.contentHours}h
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("pages-reports-total-time")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {reportData.contentActiveDays}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("pages-reports-active-days")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {avgContentPerDay}h
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("pages-reports-average-day")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {reportData.contentEvolution > 0 ? "+" : ""}
                  {reportData.contentEvolution}%
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("pages-reports-evolution")}
                </p>
              </div>
            </div>

            <div className="border rounded-lg bg-card p-4 space-y-3">
              <h3 className="font-medium text-foreground text-sm">
                {t("pages-reports-distribution")}
              </h3>
              <div className="space-y-3">
                {[
                  { label: t("pages-reports-content-type-videos"), value: contentBreakdown.videos },
                  { label: t("pages-reports-content-type-articles"), value: contentBreakdown.articles },
                  { label: t("pages-reports-content-type-quizzes"), value: contentBreakdown.quizzes },
                  { label: t("pages-reports-content-type-other"), value: contentBreakdown.other },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-foreground">{breakdownPercent(value)}%</span>
                    </div>
                    <Progress value={breakdownPercent(value)} className="h-1" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg bg-card p-4">
              <h3 className="font-medium text-foreground text-sm mb-3">
                {t("pages-reports-activity")}
              </h3>
              <ActivityChart data={reportData.contentChartData} period={period} />
            </div>
          </section>

          {/* Active Time Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              {t("pages-reports-active-time-title")}
            </h2>

            <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {reportData.activeTimeHours}h
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("pages-reports-total-time")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {reportData.activeTimeSessions}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("pages-reports-active-time-sessions")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {avgSessionMinutes}m
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("pages-reports-active-time-avg-session")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {reportData.activeTimeEvolution > 0 ? "+" : ""}
                  {reportData.activeTimeEvolution}%
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("pages-reports-evolution")}
                </p>
              </div>
            </div>

            <div className="border rounded-lg bg-card p-4">
              <h3 className="font-medium text-foreground text-sm mb-3">
                {t("pages-reports-activity")}
              </h3>
              <ActivityChart data={reportData.activeTimeChartData} period={period} />
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
