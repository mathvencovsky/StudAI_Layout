import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReportData } from "@/hooks/reports/use-reports";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { ActivityChart } from "@/components/analytics/activity-chart";
import { useTranslation } from "react-i18next";
import type { ReportPeriod } from "@/hooks/reports/use-reports";

export function ReportsPageIntegrated() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<ReportPeriod>("week");
  const { data: reportData, isLoading, error, refetch } = useReportData(period);

  const avgContentPerDay =
    reportData && reportData.contentActiveDays > 0
      ? Math.round((reportData.contentHours / reportData.contentActiveDays) * 10) / 10
      : 0;

  const avgSessionMinutes =
    reportData && reportData.activeTimeSessions > 0
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
          {isLoading && <LoadingState />}
          {error && <ErrorState error={error} onRetry={refetch} />}

          {reportData && (
            <>
              {/* Completions Section */}
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">
                  {t("pages-reports-completions-title")}
                </h2>
                <div className="grid grid-cols-3 gap-3 border rounded-lg p-4 bg-card">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {reportData.contentCompleted}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {t("pages-reports-completions-content")}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {reportData.modulesCompleted}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {t("pages-reports-completions-modules")}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {reportData.tracksCompleted}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {t("pages-reports-completions-tracks")}
                    </p>
                  </div>
                </div>
              </section>

              {/* Content Hours Section */}
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">
                  {t("pages-reports-content-hours-title")}
                </h2>
                <div className="grid grid-cols-3 gap-3 border rounded-lg p-4 bg-card">
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
                </div>
                <div className="border rounded-lg bg-card p-4">
                  <h3 className="font-medium text-foreground text-sm mb-3">
                    {t("pages-reports-content-activity")}
                  </h3>
                  <ActivityChart data={reportData.contentChartData} period={period} />
                </div>
              </section>

              {/* Active Time Section */}
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">
                  {t("pages-reports-active-time-title")}
                </h2>
                <div className="grid grid-cols-3 gap-3 border rounded-lg p-4 bg-card">
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
                </div>
                <div className="border rounded-lg bg-card p-4">
                  <h3 className="font-medium text-foreground text-sm mb-3">
                    {t("pages-reports-active-time-activity")}
                  </h3>
                  <ActivityChart data={reportData.activeTimeChartData} period={period} />
                </div>
              </section>

              {/* Streak Section */}
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">
                  {t("pages-reports-streak-title")}
                </h2>
                <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-card">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {reportData.currentStreak} {t("pages-reports-streak-days")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {t("pages-reports-streak-current")}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {reportData.longestStreak} {t("pages-reports-streak-days")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {t("pages-reports-streak-longest")}
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
