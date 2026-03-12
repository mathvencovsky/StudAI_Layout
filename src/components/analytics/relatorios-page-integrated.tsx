import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useReportData } from "@/hooks/reports/use-reports";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";
import type { ReportPeriod } from "@/api/stubs/reports-stub";

export function RelatoriosPageIntegrated() {
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

  const formatDistTotal = reportData.breakdown.sessions + reportData.breakdown.assessments + reportData.breakdown.reviews;
  const formatDistPercent = (value: number) => {
    return formatDistTotal > 0 ? Math.round((value / formatDistTotal) * 100) : 0;
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const maxMinutes = Math.max(...reportData.chartData.map((d) => d.minutes), 1);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages.reports.title", "Relatórios")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages.reports.description", "Dados de estudo.")}
        </p>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as ReportPeriod)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">{t("pages.reports.week", "Semana")}</TabsTrigger>
          <TabsTrigger value="month">{t("pages.reports.month", "Mês")}</TabsTrigger>
          <TabsTrigger value="year">{t("pages.reports.year", "Ano")}</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {reportData.totalHours}h
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("pages.reports.total", "Total")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {reportData.consistency}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("pages.reports.active-days", "Dias ativos")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {Math.round(reportData.totalHours / reportData.consistency)}h
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("pages.reports.average", "Média/dia")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                +{reportData.evolution}%
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("pages.reports.evolution", "Evolução")}
              </p>
            </div>
          </div>

          {/* Format Distribution */}
          <section className="border rounded-lg bg-card p-4 space-y-3">
            <h3 className="font-medium text-foreground text-sm">
              {t("pages.reports.distribution", "Distribuição")}
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {t("pages.reports.sessions", "Sessões")}
                  </span>
                  <span className="text-foreground">
                    {formatDistPercent(reportData.breakdown.sessions)}%
                  </span>
                </div>
                <Progress value={formatDistPercent(reportData.breakdown.sessions)} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {t("pages.reports.assessments", "Avaliações")}
                  </span>
                  <span className="text-foreground">
                    {formatDistPercent(reportData.breakdown.assessments)}%
                  </span>
                </div>
                <Progress value={formatDistPercent(reportData.breakdown.assessments)} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {t("pages.reports.reviews", "Revisões")}
                  </span>
                  <span className="text-foreground">
                    {formatDistPercent(reportData.breakdown.reviews)}%
                  </span>
                </div>
                <Progress value={formatDistPercent(reportData.breakdown.reviews)} className="h-1" />
              </div>
            </div>
          </section>

          {/* Activity Chart */}
          {period === "week" && (
            <section className="border rounded-lg bg-card p-4">
              <h3 className="font-medium text-foreground text-sm mb-3">
                {t("pages.reports.weekly-activity", "Atividade semanal")}
              </h3>
              <div className="flex justify-between gap-2">
                {reportData.chartData.slice(0, 7).map((day, index) => {
                  const intensity = day.minutes / maxMinutes;
                  return (
                    <div key={index} className="flex-1 text-center">
                      <div
                        className="w-full aspect-square rounded mb-1"
                        style={{
                          backgroundColor: `hsl(var(--primary) / ${Math.max(intensity * 0.8, 0.1)})`,
                        }}
                      />
                      <p className="text-[10px] text-muted-foreground">
                        {weekDays[new Date(day.date).getDay()]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
