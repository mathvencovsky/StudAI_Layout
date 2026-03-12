import { createFileRoute } from "@tanstack/react-router";
import { RelatoriosPageIntegrated } from "@/components/analytics/relatorios-page-integrated";

export const Route = createFileRoute("/relatorios")({
  component: RelatoriosPageIntegrated,
  loader: () => ({ crumb: "Relatórios" }),
});
