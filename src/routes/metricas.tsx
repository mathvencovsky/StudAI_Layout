import { createFileRoute } from "@tanstack/react-router";
import { MetricasPage } from "@/components/metrics/metricas-page-simple";

export const Route = createFileRoute("/metricas")({
  component: MetricasPage,
  loader: () => ({ crumb: "Métricas" }),
});