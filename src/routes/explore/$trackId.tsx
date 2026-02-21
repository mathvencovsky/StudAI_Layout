import { createFileRoute } from "@tanstack/react-router";
import { TrackDetailPage } from "@/components/tracks/track-detail-page";

export const Route = createFileRoute("/explore/$trackId")({
  component: RouteComponent,
  loader: () => ({ crumb: "Track Detail" }),
});

function RouteComponent() {
  const { trackId } = Route.useParams();
  return <TrackDetailPage trackId={trackId} />;
}
