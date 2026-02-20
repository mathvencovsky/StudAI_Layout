import { createFileRoute } from "@tanstack/react-router";
import { SessoesPageIntegrated } from "@/components/sessions/sessoes-page-integrated";

export const Route = createFileRoute("/sessoes")({
  component: SessoesPageIntegrated,
  loader: () => ({ crumb: "Sessões" }),
});
