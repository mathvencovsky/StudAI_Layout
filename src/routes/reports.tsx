import { createFileRoute } from "@tanstack/react-router";
import { ReportsPageIntegrated } from "@/components/analytics/reports-page-integrated";

export const Route = createFileRoute("/reports")({
  component: ReportsPageIntegrated,
  loader: () => ({ crumb: "Reports" }),
});
