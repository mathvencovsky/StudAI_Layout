import { createFileRoute } from "@tanstack/react-router";
import { MetricsPage } from "@/components/metrics/metrics-page-simple";

export const Route = createFileRoute("/metrics")({
  component: MetricsPage,
  loader: () => ({ crumb: "Metrics" }),
});
