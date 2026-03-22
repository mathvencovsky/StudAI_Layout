import { createFileRoute } from "@tanstack/react-router";
import { SessionsPageIntegrated } from "@/components/sessions/sessions-page-integrated";

export const Route = createFileRoute("/sessions")({
  component: SessionsPageIntegrated,
  loader: () => ({ crumb: "Sessions" }),
});
