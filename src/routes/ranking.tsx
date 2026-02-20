import { createFileRoute } from "@tanstack/react-router";
import { RankingPage } from "@/components/ranking/ranking-page";

export const Route = createFileRoute("/ranking")({
  component: RouteComponent,
  loader: () => ({ crumb: "Ranking" }),
});

function RouteComponent() {
  return <RankingPage />;
}
