import { createFileRoute } from "@tanstack/react-router";
import { RevisoesPageIntegrated } from "@/components/review/revisoes-page-integrated";

export const Route = createFileRoute("/revisoes")({
  component: RevisoesPageIntegrated,
  loader: () => ({ crumb: "Revisões" }),
});
