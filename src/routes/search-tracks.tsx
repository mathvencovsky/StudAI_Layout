import { createFileRoute } from "@tanstack/react-router";
import { SearchTracksPage } from "@/components/tracks/search-tracks-page";

export const Route = createFileRoute("/search-tracks")({
  component: RouteComponent,
  loader: () => ({ crumb: "Search Tracks" }),
});

function RouteComponent() {
  return <SearchTracksPage />;
}
