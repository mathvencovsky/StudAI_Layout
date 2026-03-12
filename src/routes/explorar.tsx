import { createFileRoute } from "@tanstack/react-router";
import { ExplorarTrilhasPage } from "@/components/tracks/explorar-trilhas-page";

export const Route = createFileRoute("/explorar")({
  component: RouteComponent,
  loader: () => ({ crumb: "Explorar Trilhas" }),
});

function RouteComponent() {
  return <ExplorarTrilhasPage />;
}
