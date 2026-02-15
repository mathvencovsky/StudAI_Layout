import { createFileRoute } from "@tanstack/react-router";
import { TrackDetail } from "@/components/track/track-detail";

export const Route = createFileRoute("/track/$trackId/")({
  component: TrackDetailPage,
});

function TrackDetailPage() {
  const { trackId } = Route.useParams();
  return <TrackDetail trackId={trackId} />;
}
