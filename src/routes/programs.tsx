import { createFileRoute } from "@tanstack/react-router";
import { ProgramsPage } from "@/components/programs/programs-page";

export const Route = createFileRoute("/programs")({
  component: RouteComponent,
  loader: () => ({ crumb: "Programs" }),
});

function RouteComponent() {
  return <ProgramsPage />;
}
