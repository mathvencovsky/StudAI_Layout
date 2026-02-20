import { createFileRoute } from "@tanstack/react-router";
import { TrackDetailPage } from "@/components/tracks/track-detail-page";

export const Route = createFileRoute("/explorar/$trackId")({
  component: RouteComponent,
  loader: () => ({ crumb: "Detalhe da Trilha" }),
});

function RouteComponent() {
  const { trackId } = Route.useParams();
  return <TrackDetailPage trackId={trackId} />;
}
