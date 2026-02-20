import { Progress } from "@/components/ui/progress";
import { useROIMetrics, useModuleEfficiency } from "@/hooks/roi/use-roi";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";

export default function ROIEstudo() {
  const { t } = useTranslation();
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useROIMetrics();
  const { data: moduleEfficiency, isLoading: efficiencyLoading, error: efficiencyError } = useModuleEfficiency();

  if (metricsLoading || efficiencyLoading) {
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

  const roiMetrics = [
    { label: t("pages.roi.time-invested", "Tempo investido"), value: metrics.timeInvested, sublabel: t("pages.roi.since-start", "desde o início") },
    { label: t("pages.roi.efficiency", "Eficiência"), value: `${metrics.efficiency}%`, sublabel: t("pages.roi.above-average", "acima da média") },
    { label: t("pages.roi.estimated-roi", "ROI estimado"), value: metrics.estimatedROI, sublabel: t("pages.roi.salary-potential", "potencial salarial") },
    { label: t("pages.roi.velocity", "Velocidade"), value: metrics.velocity, sublabel: t("pages.roi.vs-planned", "vs. planejado") },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages.roi.title", "Métricas")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages.roi.description", "Retorno sobre tempo investido.")}
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {roiMetrics.map((metric) => (
          <section key={metric.label} className="border rounded-lg bg-card p-4">
            <p className="text-xl font-semibold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.sublabel}</p>
          </section>
        ))}
      </div>

      {/* Module Efficiency */}
      {efficiencyError && <ErrorState error={efficiencyError} onRetry={() => {}} />}
      {moduleEfficiency && (
        <section className="border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium text-foreground">
              {t("pages.roi.module-efficiency", "Eficiência por módulo")}
            </h2>
          </div>
          <div className="divide-y">
            {moduleEfficiency.map((item) => (
              <div key={item.module} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">{item.module}</span>
                  <span className="text-sm font-medium text-foreground">
                    {item.efficiency}%
                  </span>
                </div>
                <Progress value={item.efficiency} className="h-1 mb-2" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.hoursSpent}h {t("pages.roi.spent", "gastas")}</span>
                  <span>·</span>
                  <span>{item.expected}h {t("pages.roi.expected", "esperadas")}</span>
                  <span>·</span>
                  <span className={item.hoursSpent <= item.expected ? "text-foreground" : ""}>
                    {item.hoursSpent <= item.expected
                      ? `${item.expected - item.hoursSpent}h ${t("pages.roi.saved", "economizadas")}`
                      : `${item.hoursSpent - item.expected}h ${t("pages.roi.extra", "extras")}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Insight */}
      <section className="border rounded-lg bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">
          {t("pages.roi.observation", "Observação")}
        </p>
        <p className="text-sm text-foreground">
          {t("pages.roi.insight", "Eficiência 23% acima da média de usuários com objetivos similares.")}
        </p>
      </section>
    </div>
  );
}
