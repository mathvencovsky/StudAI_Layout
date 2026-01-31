import { createFileRoute } from "@tanstack/react-router";
import { TrackForm } from "@/components/track/track-form";

export const Route = createFileRoute("/track-create")({
  component: TrackCreatePage,
});

function TrackCreatePage() {
  return <TrackForm mode="create" />;
}
