import { createFileRoute } from "@tanstack/react-router";
import { ProgramasPage } from "@/components/programs/programas-page";

export const Route = createFileRoute("/programas")({
  component: RouteComponent,
  loader: () => ({ crumb: "Programas" }),
});

function RouteComponent() {
  return <ProgramasPage />;
}
