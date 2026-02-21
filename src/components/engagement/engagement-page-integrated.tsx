import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { useEngagementMetrics, useWeeklyTrend } from "@/hooks/engagement/use-engagement";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";

export default function EngagementPageIntegrated() {
  const { t } = useTranslation();
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useEngagementMetrics();
  const { data: weeklyTrend, isLoading: trendLoading } = useWeeklyTrend();

  const maxSessions = useMemo(() => {
    if (!weeklyTrend) return 0;
    return Math.max(...weeklyTrend.map((d) => d.sessions));
  }, [weeklyTrend]);

  if (metricsLoading || trendLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto">
        <LoadingState />
      </div>
    );
  }

  if (metricsError) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto">
        <ErrorState error={metricsError} onRetry={refetchMetrics} />
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages.engagement.title", "Atividade")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages.engagement.description", "Métricas de engajamento.")}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {metrics.dau.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">DAU</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {metrics.mau.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">MAU</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {metrics.dauMauRatio}%
          </p>
          <p className="text-[10px] text-muted-foreground">Stickiness</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            +{metrics.npsScore}
          </p>
          <p className="text-[10px] text-muted-foreground">NPS</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Retention */}
        <section className="border rounded-lg bg-card p-4 space-y-4">
          <h3 className="font-medium text-foreground text-sm">
            {t("pages.engagement.retention", "Retenção")}
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">D1</span>
                <span className="text-foreground">{metrics.d1Retention}%</span>
              </div>
              <Progress value={metrics.d1Retention} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">D7</span>
                <span className="text-foreground">{metrics.d7Retention}%</span>
              </div>
              <Progress value={metrics.d7Retention} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">D30</span>
                <span className="text-foreground">{metrics.d30Retention}%</span>
              </div>
              <Progress value={metrics.d30Retention} className="h-2" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("pages-engagement-benchmark")}
          </p>
        </section>

        {/* Sessions */}
        <section className="border rounded-lg bg-card p-4 space-y-3">
          <h3 className="font-medium text-foreground text-sm">
            {t("pages.engagement.sessions", "Sessões")}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-muted/30 rounded-md text-center">
              <p className="text-lg font-semibold text-foreground">
                {metrics.avgSessionsPerDay}
              </p>
              <p className="text-[10px] text-muted-foreground">{t("pages-engagement-per-day")}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-md text-center">
              <p className="text-lg font-semibold text-foreground">
                {metrics.avgSessionDuration}min
              </p>
              <p className="text-[10px] text-muted-foreground">{t("pages-engagement-duration")}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-md text-center">
              <p className="text-lg font-semibold text-foreground">
                {metrics.avgTimePerWeek}h
              </p>
              <p className="text-[10px] text-muted-foreground">{t("pages-engagement-week")}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Feature Adoption */}
      <section className="border rounded-lg bg-card p-4 space-y-3">
        <h3 className="font-medium text-foreground text-sm">
          {t("pages.engagement.adoption", "Adoção")}
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">{t("pages-engagement-guided-sessions")}</span>
              <span className="text-foreground">{metrics.aiSessionsPercent}%</span>
            </div>
            <Progress value={metrics.aiSessionsPercent} className="h-1" />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">{t("pages-engagement-quizzes-completed")}</span>
              <span className="text-foreground">{metrics.quizCompletionRate}%</span>
            </div>
            <Progress value={metrics.quizCompletionRate} className="h-1" />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">{t("pages-engagement-tracks-completed")}</span>
              <span className="text-foreground">{metrics.trailCompletionRate}%</span>
            </div>
            <Progress value={metrics.trailCompletionRate} className="h-1" />
          </div>
        </div>
      </section>

      {/* Weekly Trend */}
      {weeklyTrend && (
        <section className="border rounded-lg bg-card p-4">
          <h3 className="font-medium text-foreground text-sm mb-3">
            {t("pages.engagement.weekly-trend", "Tendência semanal")}
          </h3>
          <div className="flex items-end gap-2 h-24">
            {weeklyTrend.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary rounded"
                  style={{ height: `${(day.sessions / maxSessions) * 60}px` }}
                />
                <span className="text-[10px] text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
