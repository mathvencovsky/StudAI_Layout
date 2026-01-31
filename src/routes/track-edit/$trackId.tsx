import { createFileRoute } from "@tanstack/react-router";
import { TrackForm } from "@/components/track/track-form";
import { useTrack } from "@/hooks/track/use-track";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/track-edit/$trackId")({
  component: TrackEditPage,
});

function TrackEditPage() {
  const { trackId } = Route.useParams();
  const { t } = useTranslation();
  const { data: track, isLoading } = useTrack(trackId);

  if (isLoading) return <div>{t("loading")}</div>;
  if (!track) return <div>{t("track-not-found")}</div>;

  return (
    <TrackForm
      mode="edit"
      trackId={trackId}
      initialData={{
        title: track.title,
        description: track.description,
        rootModuleId: track.rootModuleId,
        parentByModuleId: track.parentByModuleId as Record<string, string>,
      }}
    />
  );
}
