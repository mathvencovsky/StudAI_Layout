import { createFileRoute } from "@tanstack/react-router";
import { CalendarPageIntegrated } from "@/components/calendar/calendar-page-integrated";

export const Route = createFileRoute("/calendar")({
  component: CalendarPageIntegrated,
  loader: () => ({ crumb: "Calendar" }),
});
