import { createFileRoute } from "@tanstack/react-router";
import { PesquisarTrilhasPage } from "@/components/tracks/pesquisar-trilhas-page";

export const Route = createFileRoute("/pesquisar-trilhas")({
  component: RouteComponent,
  loader: () => ({ crumb: "Pesquisar Trilhas" }),
});

function RouteComponent() {
  return <PesquisarTrilhasPage />;
}
