import { createFileRoute } from "@tanstack/react-router";
import { ExploreTracksPage } from "@/components/tracks/explore-tracks-page";

export const Route = createFileRoute("/explore")({
  component: RouteComponent,
  loader: () => ({ crumb: "Explore Tracks" }),
});

function RouteComponent() {
  return <ExploreTracksPage />;
}
