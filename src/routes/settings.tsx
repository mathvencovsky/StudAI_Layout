import { createFileRoute } from "@tanstack/react-router";
import SettingsPageIntegrated from "@/components/settings/settings-page-integrated";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
  loader: () => ({ crumb: "Settings" }),
});

function RouteComponent() {
  return <SettingsPageIntegrated />;
}
