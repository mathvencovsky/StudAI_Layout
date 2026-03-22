import { createFileRoute } from "@tanstack/react-router";
import { TrackForm } from "@/components/track/track-form";
import { useTrack } from "@/hooks/track/use-track";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/track/$trackId/edit")({
  component: TrackEditPage,
  loader: () => ({ crumb: "Edit" }),
});

function TrackEditPage() {
  const { trackId } = Route.useParams();
  const { t } = useTranslation();
  const { data: track, isLoading } = useTrack(trackId);

  if (isLoading) return <div>{t("loading")}</div>;
  if (!track) return <div>{t("track-not-found")}</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("edit-track")}</h1>
        <p className="text-muted-foreground">{t("edit-track-description")}</p>
      </div>
      <TrackForm
        mode="edit"
        trackId={trackId}
        initialData={{
          title: track.title,
          description: track.description,
          rootModuleId: track.rootModuleId,
          parentByModuleId: track.parentByModuleId as Record<string, string>,
          categories: track.categories ?? [],
        }}
      />
    </div>
  );
}
