import { createFileRoute } from "@tanstack/react-router";
import { MeuPlanoPage } from "@/components/plan/meu-plano-page";

export const Route = createFileRoute("/trilha")({
  component: RouteComponent,
  loader: () => ({ crumb: "Minha Trilha" }),
});

function RouteComponent() {
  return <MeuPlanoPage />;
}
