import { createFileRoute } from "@tanstack/react-router";
import { CalendarioPageIntegrated } from "@/components/calendar/calendario-page-integrated";

export const Route = createFileRoute("/calendario")({
  component: CalendarioPageIntegrated,
  loader: () => ({ crumb: "Calendário" }),
});
